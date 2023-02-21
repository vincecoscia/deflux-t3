import { useState } from "react";

function ColorPicker({ color, tagId, updateTagColor} ) {
 
  //creating state to store our color and also set color using onChange event for block picker
  const [selectedColor, setSelectedColor] = useState(color);

  const colors = [
    "#18B4B7",
    "#F2C94C",
    "#F2994A",
    "#EB5757",
    "#2F80ED",
    "#9B51E0",
    "#27AE60",
    "#828282",
  ];

  const handleColorChange = (color, tagId) => {
    console.log('COLOR', color)
    console.log('TAG ID', tagId)
    setSelectedColor(color);
    updateTagColor({ id: tagId, color: color })
  };


  console.log('SELECTED COLOR', selectedColor)
  console.log('TAG COLOR', color)

  return (
    <div className="absolute top-10 z-20 w-max">
      <div className="lg:flex lg:flex-row bg-gray-700 rounded-md p-3 gap-x-4 grid grid-cols-3 gap-y-2">
        {colors.map((color) => (
          <div
            key={color}
            className={`w-6 h-6 col rounded-full cursor-pointer` + (color === selectedColor ? " border-2 border-white" : "")}
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange(color, tagId)}
          />
        ))}
        </div>
    </div>
  );
}

export default ColorPicker;