"use client"

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'

export default function Graphs({ chartData, chartLabels, colour }) {
  const options = {
    scales: {
      x: {
        ticks: {
          color: 'rgba(255,255,255,0.8)', // Set the color of x-axis ticks
        }
      },
      y: {
        ticks: {
          color: 'rgba(255,255,255,0.8)', // Set the color of y-axis ticks
        }
      },
    },
  };

  return (


    <Line
      datasetIdKey='id'
      data={{
        labels: chartLabels,
        datasets: [
          {

            label: '',
            data: chartData,
            borderColor: colour
          },

        ],
      }}
      options={options}
    />

  )
}