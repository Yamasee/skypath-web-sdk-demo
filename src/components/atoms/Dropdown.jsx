import { useState } from 'react';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const DropdownItem = (props) => {
  const { item, handleChange } = props;
  const { label, value } = item;

  return (
    <DropdownMenu.Item
      onClick={() => handleChange(value)}
      className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none hover:bg-gray-500 hover:text-white data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
    >
      {label}
    </DropdownMenu.Item>
  )
}

const Dropdown = (props) => {
  const { options, onChange, defaultValue } = props;
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0].value);

  const handleChange = (value) => {
    setSelectedValue(value);
    onChange(value);
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-md w-[56px] h-[35px] inline-flex items-center justify-center text-violet11 bg-white outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black"
          aria-label="Customise options"
        >
          {options.find((item) => item.value === selectedValue).label}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w bg-white cursor-pointer rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          {options.map((item) => <DropdownItem key={item.value} item={item} handleChange={handleChange} />)}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;