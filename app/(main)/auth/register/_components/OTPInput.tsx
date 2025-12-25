"use client";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

type Props = {
  length: number;
  onComplete: (value: string) => void;
};

export default function OTPInput({ length, onComplete }: Props) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRef = useRef<HTMLInputElement[]>([]);

  const combinedOtp = otp.join("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = event.target.value;

    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const newCombinedOtp = newOtp.join("");
    if (newCombinedOtp.length === length) {
      onComplete(newCombinedOtp);
    }

    if (value && index < length - 1) {
      setTimeout(() => {
        const nextInput = inputRef.current[index + 1];

        if (nextInput) {
          nextInput.focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = inputRef.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const firstEmptyIndex = otp.findIndex((digit) => digit === "");

  const handleFocus = (index: number) => {
    if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
      const firstEmptyInput = inputRef.current[firstEmptyIndex];
      if (firstEmptyInput) {
        firstEmptyInput.focus();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 lg:items-start">
      <p className="pt-6">Verification Code</p>
      <div className="flex gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRef.current[index] = element!;
            }}
            type="numeric"
            value={digit}
            onChange={(event) => handleChange(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            maxLength={1}
            onFocus={() => handleFocus(index)}
            className={`h-10 w-10 rounded-md border-2 border-[#dedede] text-center text-2xl lg:text-3xl outline-none sm:h-12 sm:w-12 lg:h-18 lg:w-18 ${
              digit.length !== 0 ? "bg-[#e6e6e6]" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
