import { Suspense } from "react";
import BookForm from "./book-form";

export default function BookPage() {
  return (
    <Suspense fallback={<main className="bookPage"><div className="formWrap"><div className="formCard">Loading booking form…</div></div></main>}>
      <BookForm />
    </Suspense>
  );
}
