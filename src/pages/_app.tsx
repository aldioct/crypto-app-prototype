import "../styles/theme.css";
import GlobalStyles from "src/components/GlobalStyles";
import tw from "twin.macro";
import { NextPage } from "next";
import { AppProps } from "next/dist/next-server/lib/router/router";
import Link from 'next/link'
import Image from 'next/image'

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyles />
      <main tw="w-[896px] min-h-screen right-0 left-0 m-auto">
        <nav tw="px-4 py-2">
          <div tw="flex justify-between">
            <Link href={'/'}>
              <div>
                <Image
                  src="/alogo.webp"
                  alt="Logo"
                  width={100}
                  height={75}
                  priority
                />
              </div>
            </Link>
            <div tw="flex items-center gap-x-2">
              <Link href={'/'}><button tw="font-medium px-2 py-1">Masuk</button></Link>
              <Link href={'/'}><button tw="font-medium px-2 py-1 bg-yellow-200 rounded" >Daftar</button></Link>
            </div>
          </div>
        </nav>

        <div tw="my-4">
          <Component {...pageProps} />
        </div>
      </main>
    </>

  );
};

export default App;
