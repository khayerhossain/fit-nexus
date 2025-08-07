import { PacmanLoader } from 'react-spinners'

const Loading = ({ smallHeight }) => {
  return (
    <div
      className={` ${smallHeight ? 'h-[250px]' : 'h-[70vh]'}
      flex 
      flex-col 
      justify-center 
      items-center `}
    >
      <PacmanLoader size={8} color='red'  />
    </div>
  )
}

export default Loading