"use client";

type ContactFormData = {
  location: string;
  area: string;
  name: string;
};

type ContactFormProps = {
  data: ContactFormData;
  onChange: (data: ContactFormData) => void;
};

export function ContactForm({ data, onChange }: ContactFormProps) {
  const handleChange = (field: keyof ContactFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-white text-sm font-medium">선택 사항 입력</h3>
      <div className="space-y-3">
        {/* Location */}
        <div className="flex items-center gap-3">
          <label className="text-white/70 text-sm w-20 shrink-0">시공 장소</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="장소를 입력하세요"
            className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Area */}
        <div className="flex items-center gap-3">
          <label className="text-white/70 text-sm w-20 shrink-0">넓이</label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="number"
              value={data.area}
              onChange={(e) => handleChange("area", e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
            />
            <span className="text-white/70 text-sm">m²</span>
          </div>
        </div>

        {/* Name */}
        <div className="flex items-center gap-3">
          <label className="text-white/70 text-sm w-20 shrink-0">이름</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="이름을 입력하세요"
            className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}
