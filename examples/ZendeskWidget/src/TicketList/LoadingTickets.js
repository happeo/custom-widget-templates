import React from "react";
import Skeleton from "react-loading-skeleton";

const LoadingTickets = () => {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          flex: 5,
          display: "flex",
          flexDirection: "column",
          marginBottom: "16px",
        }}
      >
        <Skeleton width="70%" height="25px" style={{ marginBottom: "8px" }} />
        <Skeleton width="80%" height="20px" />
        <Skeleton width="80%" height="20px" />
      </div>
      <div
        style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
        }}
      >
        <Skeleton width="70%" height="25px" style={{ marginBottom: "8px" }} />
        <Skeleton width="50%" height="20px" />
        <Skeleton width="50%" height="20px" />
      </div>
      <div
        style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
        }}
      >
        <Skeleton width="70%" height="25px" style={{ marginBottom: "8px" }} />
        <Skeleton width="60%" height="20px" />
        <Skeleton width="60%" height="20px" />
      </div>
    </div>
  );
};

export default LoadingTickets;
