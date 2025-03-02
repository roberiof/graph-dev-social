import { AddButtonProps } from "./types"

export const AddButton = ({ buttonType, ...props }: AddButtonProps) => {
  const colors = { 
    developer: '#00ff00',
    company: '#ff00ff'
  }
  return (
    <button className='flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-lg transition-all' {...props}>
      <div className={`w-3 h-3 rounded-full bg-[${colors[buttonType]}]`}></div>
      <span>Add {buttonType}</span>
      <span className="text-xl">+</span>
    </button>
  )}