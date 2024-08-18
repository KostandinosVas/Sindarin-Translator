import ElvishTranslator from '../components/ElvishTranslator';
import { Bilbo } from 'next/font/google'


const bilbo = Bilbo({  weight: '400', subsets: ['latin'] })

export default function Home() {
  return (
    <main className={bilbo.className}>
      <div className='flex flex-col justify-between h-[100vh]'>
      <div className='flex flex-col items-center h-[80vh] justify-around gap-y-4 xl:w-2/3 xl:mx-auto'>
        <h1 className='text-[64px] text-center font-bold text-amber-200 xl:absolute xl:left-0 xl:top-2'>Sindarin Translator</h1>
        <ElvishTranslator />
      </div>
    </div>
    </main>
  );
}