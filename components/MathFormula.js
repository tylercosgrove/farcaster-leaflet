import React from "react";
import katex from "katex";

const MathFormula = ({ formula }) => {
  const html = katex.renderToString(formula, {
    throwOnError: false,
  });

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MathFormula;
