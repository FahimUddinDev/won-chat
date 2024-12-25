import Moment from "react-moment";

function Msgl({ message, time }) {
  return (
    <div className="msg-body-l">
      <h1 className="" dangerouslySetInnerHTML={{ __html: message }}></h1>
      <data>
        <Moment fromNow>{time}</Moment>
      </data>
    </div>
  );
}

export default Msgl;
