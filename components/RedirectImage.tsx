"use client";
import { memo, useEffect, useState } from "react";

import type { ImgHTMLAttributes } from "react";

export const RedirectImage = memo(function RedirectImage({
  src,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      referrerPolicy="no-referrer"
      src={src}
      alt="redirected image"
      {...rest}
    />
  );
});
