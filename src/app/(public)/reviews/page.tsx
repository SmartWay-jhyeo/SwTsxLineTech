"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const reviews = [
  {
    id: 1,
    name: "김○○",
    rating: 5,
    date: "2025-12-02",
    service: "차선 도색",
    content: "아파트 단지 내 주차장 라인이 많이 지워져서 의뢰드렸습니다. 기존 라인 제거부터 신규 도색까지 하루 만에 깔끔하게 끝내주셨네요. 특히 장애인 주차구역과 전기차 충전구역을 눈에 띄게 잘 칠해주셔서 입주민들도 아주 만족해합니다. 추운 날씨에 고생 많으셨습니다!",
  },
  {
    id: 2,
    name: "이○○",
    rating: 5,
    date: "2025-11-25",
    service: "에폭시 시공",
    content: "지하주차장 에폭시 작업 결과물이 정말 좋네요. 직원분들도 친절하시고 전문적이셨습니다.",
  },
  {
    id: 3,
    name: "최○○",
    rating: 5,
    date: "2025-11-10",
    service: "차선 도색",
    content: "공장 주차장 라인 재도색 했는데 가격 대비 정말 만족스러워요. 추천합니다!",
  },
  {
    id: 4,
    name: "박○○",
    rating: 5,
    date: "2025-10-28",
    service: "외부 도장",
    content: "상가 건물 외벽 페인트가 낡아서 전체 도색을 맡겼습니다. 색상 선정할 때 고민이 많았는데, 사장님께서 요즘 트렌드에 맞는 컬러를 추천해주셔서 그걸로 결정했어요. 시공하고 나니 건물이 완전 새것처럼 변했습니다. 꼼꼼한 마스킹 작업 덕분에 창틀이나 간판에 묻은 것 없이 깨끗하게 마무리되었습니다. 대만족입니다.",
  },
  {
    id: 5,
    name: "정○○",
    rating: 4,
    date: "2025-10-15",
    service: "내부 도장",
    content: "견적 비교해보고 여기가 제일 괜찮아서 했습니다. 작업도 깔끔하네요.",
  },
  {
    id: 6,
    name: "강○○",
    rating: 5,
    date: "2025-09-22",
    service: "에폭시 시공",
    content: "카페 오픈 준비하면서 빈티지 바닥 느낌을 내고 싶어서 투명 에폭시 시공을 요청했습니다. 제가 원하던 거친 콘크리트 느낌은 살리면서도 표면은 매끄럽게 잘 나왔어요. 시공 중에 먼지 안 나게 신경 써주신 점도 좋았고, 무엇보다 일정을 정확히 지켜주셔서 오픈 준비에 차질이 없었습니다.",
  },
  {
    id: 7,
    name: "윤○○",
    rating: 5,
    date: "2025-09-05",
    service: "방수 공사",
    content: "옥상 우레탄 방수 공사를 했습니다. 작년 장마 때 누수가 있어서 걱정했는데, 이번에 라인테크에서 꼼꼼하게 작업해주신 덕분에 올여름 장마는 걱정 없을 것 같네요. 바닥 갈아내는 기초 작업부터 중도, 상도 코팅까지 단계별로 사진 찍어서 보내주셔서 믿음이 갔습니다.",
  },
  {
    id: 8,
    name: "임○○",
    rating: 5,
    date: "2025-08-18",
    service: "에폭시 시공",
    content: "공장 바닥 에폭시 작업 의뢰했어요. 작업 속도도 빠르고 마무리가 완벽합니다. 지게차 다녀도 끄떡없네요.",
  },
  {
    id: 9,
    name: "한○○",
    rating: 5,
    date: "2025-08-02",
    service: "차선 도색",
    content: "빌라 주차장이 협소해서 라인을 새로 그리면서 구조 변경을 요청드렸는데, 차가 다니기 편하게 동선을 잘 짜주셨습니다. 카스토퍼 설치까지 한 번에 해결해서 편했고요. 확실히 전문가의 손길은 다르네요.",
  },
  {
    id: 10,
    name: "오○○",
    rating: 4,
    date: "2025-07-20",
    service: "외부 도장",
    content: "비가 계속 와서 일정이 좀 밀리긴 했지만, 날씨 좋아지자마자 바로 오셔서 처리해주셨어요. 색감도 생각했던 대로 잘 나왔습니다.",
  },
  {
    id: 11,
    name: "서○○",
    rating: 5,
    date: "2025-07-05",
    service: "에폭시 시공",
    content: "셀프레벨링 처음 해보는데 바닥이 정말 거울처럼 평평해졌네요. 감사합니다.",
  },
  {
    id: 12,
    name: "권○○",
    rating: 5,
    date: "2025-06-12",
    service: "내부 도장",
    content: "사무실 인테리어 페인트 칠했는데, 제가 원하던 웜톤 화이트 색상을 기가 막히게 조색해주셨습니다. 냄새도 별로 안 나고, 보양 작업도 철저하게 해주셔서 바닥에 튄 자국 하나 없이 깨끗합니다. 다음에도 또 맡기고 싶어요.",
  },
  {
    id: 13,
    name: "황○○",
    rating: 5,
    date: "2025-05-25",
    service: "차선 도색",
    content: "사장님 친절하시고 작업도 빠릅니다. 굿굿.",
  },
  {
    id: 14,
    name: "송○○",
    rating: 4,
    date: "2025-05-10",
    service: "방수 공사",
    content: "오래된 건물이라 누수 걱정이 많았는데 꼼꼼하게 잘 막아주셨습니다. 비용도 합리적이었습니다.",
  },
  {
    id: 15,
    name: "전○○",
    rating: 5,
    date: "2025-04-15",
    service: "에폭시 시공",
    content: "식당 주방 바닥이라 미끄러운 게 제일 걱정이었는데, 논슬립 시공 추천해주셔서 그걸로 했습니다. 물 청소해도 안 미끄럽고 청소하기도 편해졌어요. 진작 할 걸 그랬네요.",
  },
  {
    id: 16,
    name: "홍○○",
    rating: 5,
    date: "2025-03-28",
    service: "차선 도색",
    content: "깔끔하게 잘 되었습니다. 감사합니다.",
  },
  {
    id: 17,
    name: "유○○",
    rating: 5,
    date: "2025-03-05",
    service: "외부 도장",
    content: "전원주택 외벽 도장했습니다. 3년 전에 다른 곳에서 했다가 금방 벗겨져서 속상했는데, 이번엔 사장님이 기초 작업부터 신경 많이 써주시는 게 보여서 안심이 되네요.",
  },
  {
    id: 18,
    name: "고○○",
    rating: 5,
    date: "2025-02-12",
    service: "차선 도색",
    content: "주차장 라인 전체 재시공 했는데 정말 새것처럼 깨끗해졌어요. 적극 추천합니다!",
  },
];

const ITEMS_PER_PAGE = 9;

export default function ReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const currentReviews = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">고객 후기</h1>
          <p className="text-white/60">라인테크를 이용하신 고객님들의 생생한 후기입니다</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {currentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-lg">{review.name}</h3>
                  <p className="text-white/40 text-sm">{review.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                  {review.service}
                </span>
              </div>

              <p className="text-white/70 text-sm leading-relaxed line-clamp-6 flex-1">
                {review.content}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={cn(
                "w-10 h-10 rounded-lg text-sm font-medium transition-all",
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
              )}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
