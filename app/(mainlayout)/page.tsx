import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  return (
    <section className="min-h-screen">
      <div className="my-20 flex flex-col items-center justify-center text-center gap-5">
        <h1 className="text-5xl font-semibold text-center">
          Unlock Knowledge Instantly from Your Pdfs
        </h1>
        <h3 className="text-xl font-medium text-center text-gray-500">
          Upload your Pdfs and get immediate answers with
          <span className="font-semibold text-purple-600">
            &nbsp;Askify&nbsp;
          </span>
          powered by AI.
        </h3>
        <Button asChild className="capitalize">
          <Link href={"/sign-up"}>get started</Link>
        </Button>
      </div>
      <div className="mb-32 mt-32">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl sm:text-5xl">
              Start quering in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Chatting to your PDF files has never been easier than with Askify.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-10">
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary relative">
            <CardHeader>
              <CardTitle>Sign up for an account</CardTitle>
            </CardHeader>
            <CardContent>
              Either starting out with a free plan or choose our{" "}
              <Link
                href="/pricing"
                className="text-blue-700 underline underline-offset-2"
              >
                pro plan
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary relative">
            <CardHeader>
              <CardTitle>Upload your PDF file</CardTitle>
            </CardHeader>
            <CardContent>
              We&apos;ll process your file and make it ready for you to chat
              with.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary relative">
            <CardHeader>
              <CardTitle>Start asking questions</CardTitle>
            </CardHeader>
            <CardContent>
              It&apos;s that simple. Try out Quill today - it really takes less
              than a minute.
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="px-6 lg:px-8">
        <div className="mt-16 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <Image
              src="/preview.jpg"
              alt="product preview"
              width={1364}
              height={866}
              quality={100}
              className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
