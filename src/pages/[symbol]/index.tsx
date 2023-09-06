import React, { useState, useEffect, useRef } from "react"
import SocketIOClient from "socket.io-client"
import tw from "twin.macro";
import { useRouter } from 'next/router'
import { DCrypto } from "src/mock/cryptoDummy"
import {
  DBTCHistory,
  DBTCMarketJual,
  DBTCMarketBeli
} from "src/mock/btcHistoryDummy"
import {
  DETHHistory,
  DETHMarketJual,
  DETHMarketBeli
} from "src/mock/ethHistoryDummy"
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DetailPage() {
  const router = useRouter()
  const currentSymbol = router.query.symbol
  
  const [detail, setDetail] = useState<any>({});
  const [marketJual, setMarketJual] = useState<any[]>([]);
  const [marketBeli, setMarketBeli] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    if(!router.isReady) return

    setDetail(DCrypto.find(e => e.symbol === currentSymbol))
    setAllData()
  }, [router.isReady])

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

  const setAllData = () => {
    let data = []

    if(currentSymbol === 'BTCIDR') {
      data = DBTCHistory.map(history => {
        return {
          x: new Date(history.Time),
          y: [history.Open, history.High, history.Low, history.Close]
        }
      })
    } else if(currentSymbol === 'ETHIDR') {
      data = DETHHistory.map(history => {
        return {
          x: new Date(history.Time),
          y: [history.Open, history.High, history.Low, history.Close]
        }
      })
    }

    setHistoryData([{ data }])

    switch (currentSymbol) {
      case 'BTCIDR':
        setMarketJual(DBTCMarketJual)
        setMarketBeli(DBTCMarketBeli)
        break;

      case 'ETHIDR':
        setMarketJual(DETHMarketJual)
        setMarketBeli(DETHMarketBeli)
        break;

      default:
        break;
    }
  }

  const chartOpt: any= {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  }

  return (
    <div tw="flex flex-col gap-y-2">
      <div tw="p-4 bg-white rounded w-full">
        <div id="chart">
          <ApexChart options={chartOpt} series={historyData} type="candlestick" height={350} />
        </div>
      </div>

      <div tw="flex gap-x-2">
        <div tw="p-4 bg-white rounded w-full flex flex-col gap-y-2">
          <div tw="text-sm font-medium">Market Jual</div>
          <div tw="h-96 overflow-auto">
            <table tw="table-auto w-full">
              <thead>
                <tr tw="bg-yellow-200">
                  <th tw="text-[13px] p-2 font-medium text-left">Harga</th>
                  <th tw="text-[13px] p-2 font-medium text-left">{detail?.traded_currency_unit}</th>
                  <th tw="text-[13px] p-2 font-medium text-left">{detail?.base_currency}</th>
                </tr>
              </thead>
              <tbody>
                {marketJual.map((markVal, index) => (
                  <tr key={index}>
                    <td tw="p-2">{markVal.price}</td>
                    <td tw="p-2">{markVal.tradedPrice}</td>
                    <td tw="p-2">{markVal.basePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div tw="p-4 bg-white rounded w-full flex flex-col gap-y-2">
          <div tw="text-sm font-medium">Market Beli</div>
          <div tw="h-96 overflow-auto">
            <table tw="table-auto w-full">
              <thead>
                <tr tw="bg-yellow-200">
                  <th tw="text-[13px] p-2 font-medium text-left">Harga</th>
                  <th tw="text-[13px] p-2 font-medium text-left">{detail?.traded_currency_unit}</th>
                  <th tw="text-[13px] p-2 font-medium text-left">{detail?.base_currency}</th>
                </tr>
              </thead>
              <tbody>
                {marketBeli.map((markVal, index) => (
                  <tr key={index}>
                    <td tw="p-2">{markVal.price}</td>
                    <td tw="p-2">{markVal.tradedPrice}</td>
                    <td tw="p-2">{markVal.basePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}