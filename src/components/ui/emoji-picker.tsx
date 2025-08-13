"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiPickerProps {
   onEmojiSelect: (emoji: any) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
   return (
      <Picker
         data={data}
         onEmojiSelect={(emoji: any) => onEmojiSelect(emoji.native)}
         theme="light"
         previewPosition="none"
      />
   );
}
