"use client"


import Image from "next/image";
import React, { useEffect, useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ForexNews = {
  id: number,
  title: string,
  main_asset: string,
  summary: string,
  date: string,
  sentiment: string,
  full_description: string,
  breakdown: string,
  source_url: string,
  polarity: number,
  subjectivity: number,
  trade_idea: string

}


const PAGE_SIZE = 50



export default function Home() {

  const [news, setNews] = useState<ForexNews[]>([])
  const [filteredNews, setFilteredNews] = useState<ForexNews[]>([])
  const [search, setSearch] = useState("")
  const [mainAssetFilter, setMainAssetFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)


  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await axios.get("http://localhost:5000/api/forex-news")
      data.reverse()
      console.log({data})
      setNews(data)
      setFilteredNews(data)
    }

    fetchNews()
  }, [])

  useEffect(() => {
    let filtered = news;
    if (search) {
      filtered = filtered.filter((item) =>
        item.main_asset.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (mainAssetFilter) {
      filtered = filtered.filter((item) => item.main_asset === mainAssetFilter);
    }
    setFilteredNews(filtered);
    setCurrentPage(1);
  }, [search, mainAssetFilter, news]);

  const totalPages = Math.ceil(filteredNews.length / PAGE_SIZE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );



  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Search by main asset..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        <Select onValueChange={setMainAssetFilter}>
          <SelectTrigger className="w-full md:w-1/4">
            <SelectValue placeholder="Filter by main asset" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(news.map((item) => item.main_asset))].map((asset) => (
              <SelectItem key={asset} value={asset}>
                {asset}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNews.map((item) => (
          <Card key={item.id} className="rounded-2xl shadow-lg p-4">
            <CardContent className="space-y-2">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.date}</p>
              <p>
                <strong>Main Asset:</strong> {item.main_asset}
              </p>
              <p>
                <strong>Sentiment:</strong> {item.sentiment}
              </p>
              <p>
                <strong>Summary:</strong> {item.summary}
              </p>
              <p>
                <strong>Polarity:</strong> {item.polarity}
              </p>
              <p>
                <strong>Subjectivity:</strong> {item.subjectivity}
              </p>
              <p>
                <strong>Breakdown:</strong> {item.breakdown}
              </p>
              <p>
                <strong>Insights:</strong> {item.trade_idea}
              </p>
              <p>
                <strong>Link:</strong> <a target="_blank" href={item.source_url}>{item.source_url}</a>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-2">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
