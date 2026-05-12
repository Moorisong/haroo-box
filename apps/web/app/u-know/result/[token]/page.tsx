import ResultContent from '@/contents/u-know/components/result-content';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function UKnowResultPage({ params }: PageProps) {
  const { token } = await params;
  return <ResultContent token={token} />;
}
