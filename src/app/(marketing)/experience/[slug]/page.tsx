import { redirect } from "next/navigation";

export default function ExperiencePage({ params }: { params: { slug: string } }) {
  // Map legacy experience slugs to modern activity slugs
  const slug = params.slug.toLowerCase();
  if (slug.includes("coffee") || slug.includes("cafe")) {
    redirect("/explore/coffee-chat");
  } else if (slug.includes("gym") || slug.includes("fitness")) {
    redirect("/explore/gym-partner");
  } else if (slug.includes("movie") || slug.includes("cinema")) {
    redirect("/explore/movie-buddy");
  } else if (slug.includes("walk") || slug.includes("city")) {
    redirect("/explore/city-guide");
  } else if (slug.includes("shop")) {
    redirect("/explore/shopping-buddy");
  } else {
    redirect("/explore");
  }
}
