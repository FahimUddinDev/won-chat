import { apiSlice } from "../apiSlice/apiSlice";
import { chatApi } from "../chat/apiSlice";

const refreshTokenMiddleware = (store) => (next) => async (action) => {
  // Pass action to the next middleware or reducer
  const payload = action?.meta?.arg?.originalArgs;
  const result = next(action);

  // Check if the action is related to an API call
  if (action.type.endsWith("/rejected")) {
    const { meta } = action;

    if (meta.baseQueryMeta.response.status === 401) {
      // Attempt to refresh the token
      const refreshResponse = await store.dispatch(
        chatApi.endpoints.refreshAuth.initiate({
          refreshToken: store.getState().auth.refreshToken,
        })
      );

      if (refreshResponse.data) {
        const entries = apiSlice.util.selectInvalidatedBy(
          store.getState((state) => state),
          [meta.arg.endpointName]
        );
        const retryData = await store.dispatch(
          apiSlice.endpoints[meta.arg.endpointName].initiate(payload, {
            forceRefetch: true,
          })
        );

        return retryData;
      } else {
        window.location.replace("http://localhost:3000/auth/login");
        return;
      }
    }
  }

  return result;
};

export default refreshTokenMiddleware;
