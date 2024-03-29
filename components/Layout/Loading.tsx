import ReactLoading from "react-loading";
import "./styles/loading.less";

const Loading = () => {
  return (
    <div className="g-loading">
      <ReactLoading
        type={"spinningBubbles"}
        color={"#df9100"}
        height={400}
        width={375}
      />
    </div>
  );
};

export default Loading;
