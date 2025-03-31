import Image from "next/image";

const PreviewSection = () => {
  return (
    <div className="py-20 bg-muted/50">
      <div className="container px-4 md:px-10">
        <Image
          src="/preview.png"
          alt="product preview"
          width={1600}
          height={500}
          quality={100}
          className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-lg ring-1 ring-gray-900/10"
        />
      </div>
    </div>
  );
};

export default PreviewSection;
