import Moment from "react-moment";

function Msgr({ time, message }) {
  return (
    <div className="msg-body-r">
      <data>
        <Moment fromNow>{time}</Moment>
      </data>
      <p className="" dangerouslySetInnerHTML={{ __html: message }}></p>
    </div>
  );
}

export default Msgr;
