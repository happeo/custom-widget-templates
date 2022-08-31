import { useEffect } from "react";
import * as d3 from "d3";

export const useZoomPan = ({ initialized }) => {
  useEffect(() => {
    const initD3 = () => {
      var svgs = d3.selectAll(`.mermaid svg`);
      console.log({ svgs });
      svgs.each(function () {
        var svg = d3.select(this);
        svg.html("<g>" + svg.html() + "</g>");
        var inner = svg.select("g");
        var zoom = d3.zoom().on("zoom", function (event) {
          inner.attr("transform", event.transform);
        });
        svg.call(zoom);
      });
    };

    window.addEventListener("load", initD3);
    if (initialized) initD3();

    return () => {
      window.removeEventListener("load", initD3);
    };
  }, [initialized]);

  return null;
};
