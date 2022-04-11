import React from "react";
import Skeleton from "react-loading-skeleton";

const LoadingArticle = () => {
  return (
    <div style={{ display: "flex", flexDirection: 'column' }}>
        <Skeleton width="40%" height="35px" style={{ marginBottom: "10px" }} />
        <Skeleton width="70%" height="25px" style={{ marginBottom: "16px" }} />
        <Skeleton width="80%" height="20px" style={{ marginBottom: "4px" }} />
        <Skeleton width="80%" height="20px" style={{ marginBottom: "4px" }} />
        <Skeleton width="80%" height="20px" style={{ marginBottom: "4px" }} />
        <Skeleton width="80%" height="20px" style={{ marginBottom: "4px" }} />
        <Skeleton width="80%" height="20px" style={{ marginBottom: "4px" }} />
        <Skeleton width="80%" height="20px" style={{ marginBottom: "4px" }} />
        <Skeleton width="80%" height="20px" style={{ marginBottom: "4px" }} />
    </div>
  );
};

export default LoadingArticle;
