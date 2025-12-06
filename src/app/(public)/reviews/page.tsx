import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "김○○",
    rating: 5,
    date: "2024-11-20",
    service: "차선 도색",
    content: "주차장 라인 작업 의뢰했는데 정말 깔끔하고 빠르게 처리해주셨어요. 가격도 합리적이고 만족스럽습니다!",
  },
  {
    id: 2,
    name: "이○○",
    rating: 5,
    date: "2024-11-15",
    service: "에폭시 시공",
    content: "지하주차장 에폭시 작업 했는데 결과물이 정말 좋네요. 직원분들도 친절하시고 전문적이셨습니다.",
  },
  {
    id: 3,
    name: "박○○",
    rating: 4,
    date: "2024-11-10",
    service: "외부 도장",
    content: "건물 외벽 도장 작업 맡겼어요. 꼼꼼하게 잘 해주셨고, 약속한 일정도 잘 지켜주셨습니다.",
  },
  {
    id: 4,
    name: "최○○",
    rating: 5,
    date: "2024-11-05",
    service: "차선 도색",
    content: "공장 주차장 라인 재도색 했는데 가격 대비 정말 만족스러워요. 추천합니다!",
  },
  {
    id: 5,
    name: "정○○",
    rating: 5,
    date: "2024-10-28",
    service: "에폭시 시공",
    content: "창고 바닥 에폭시 시공 맡겼는데 결과가 기대 이상입니다. 내구성도 좋을 것 같아요.",
  },
  {
    id: 6,
    name: "강○○",
    rating: 4,
    date: "2024-10-20",
    service: "내부 도장",
    content: "사무실 리모델링 도장 작업했어요. 깔끔하고 냄새도 금방 없어졌습니다.",
  },
  {
    id: 7,
    name: "윤○○",
    rating: 5,
    date: "2024-10-15",
    service: "차선 도색",
    content: "아파트 지하주차장 라인 작업 했는데 주민들 반응이 정말 좋아요. 감사합니다!",
  },
  {
    id: 8,
    name: "임○○",
    rating: 5,
    date: "2024-10-10",
    service: "에폭시 시공",
    content: "공장 바닥 에폭시 작업 의뢰했어요. 작업 속도도 빠르고 마무리가 완벽합니다.",
  },
  {
    id: 9,
    name: "한○○",
    rating: 4,
    date: "2024-10-05",
    service: "외부 도장",
    content: "상가 외벽 도장 맡겼는데 색감도 예쁘게 나왔고 깔끔하게 잘 해주셨어요.",
  },
  {
    id: 10,
    name: "조○○",
    rating: 5,
    date: "2024-09-28",
    service: "차선 도색",
    content: "주차장 라인 전체 재시공 했는데 정말 새것처럼 깨끗해졌어요. 적극 추천합니다!",
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">고객 후기</h1>
          <p className="text-white/60">라인테크를 이용하신 고객님들의 생생한 후기입니다</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors"
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

              <p className="text-white/70 text-sm leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
