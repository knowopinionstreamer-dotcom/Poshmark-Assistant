import ItemDetailsForm from '@/components/item-details-form';

export default function PoshmarkProListerPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">Poshmark Pro Lister</h1>
        <p className="text-muted-foreground mt-2">Your AI-powered assistant for faster, smarter reselling.</p>
      </header>
      <ItemDetailsForm />
    </main>
  );
}
