export function Footer() {
  return (
    <footer className="border-t mt-auto py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
        <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Rezzkiel Illusion. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
