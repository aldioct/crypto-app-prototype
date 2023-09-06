import React, { useEffect, useRef } from "react";
import SocketIOClient from "socket.io-client";
import tw from "twin.macro";
import Image from 'next/image'
import { DCrypto } from "src/mock/cryptoDummy";
import { useRouter } from 'next/router'

const Index: React.FC = () => {
  const router = useRouter()
  const crytoList = useRef(DCrypto)

  useEffect((): any => {
    // connect to socket server
    const socket = SocketIOClient.connect(process.env.BASE_URL, {
      path: "/api/socketio",
    })

    // log socket connection
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    })

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, [])

  const useIsMinus = (value: string): boolean => {
    return value.includes('-')
  }

  return (
    <>
      <div tw="mb-12">
        <div tw="font-bold text-6xl">Crypto Exchange</div>
        <div tw="font-bold text-6xl">Trading page</div>
      </div>
      <div tw="bg-white rounded">
        <table tw="table-auto w-full">
          <thead>
            <tr>
              <th tw="p-4 font-medium text-left">Nama</th>
              <th tw="p-4 font-medium text-left">Harga Terakhir</th>
              <th tw="p-4 font-medium text-left">Perubahan 24 Jam</th>
            </tr>
          </thead>
          <tbody>
            {crytoList.current.map((crypto) => (
              <tr key={crypto.symbol} onClick={() => router.push(`/${crypto.symbol}`)} tw="cursor-pointer hover:bg-blue-50/50">
                <td tw="p-4 flex gap-x-1 items-center">
                  <Image
                    src={crypto.img}
                    alt="Logo"
                    width={40}
                    height={40}
                    priority
                  />
                  <span>{crypto.name}</span>
                </td>
                <td tw="p-4">{crypto.price}</td>
                <td tw="p-4">
                  <div
                    tw="px-3 py-2 text-center rounded max-w-[90px] min-w-[90px]"
                    css={useIsMinus(crypto.changepct) ? tw`bg-red-50/50 text-red-500` : tw`bg-green-50/50 text-green-500`}
                  >
                    {`${!useIsMinus(crypto.changepct) ? "+" : ""}${crypto.changepct}%`}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Index;
