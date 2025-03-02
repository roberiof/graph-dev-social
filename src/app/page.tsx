import { GraphDataProvider } from '@/common/context/GraphData'
import AddNodes from '@/components/organisms/AddNodes/AddNodes'
import ServerGraph from '@/components/organisms/Graph/ServerGraph/ServerGraph'
const Chat = () => {
  return (
    <div className='h-screen w-screen relative overflow-hidden'>
      <GraphDataProvider>
        <AddNodes />
        <ServerGraph />
      </GraphDataProvider>
    </div>
  )
}

export default Chat