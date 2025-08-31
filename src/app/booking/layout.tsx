
// app/about/layout.tsx
export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <main>{children}</main> {/* <== Di sini konten page.tsx masuk */}
    </div>
  );
}