import PlayContent from '@/contents/u-know/components/play-content';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function UKnowPlayPage({ params }: PageProps) {
  const { token } = await params;
  return <PlayContent token={token} />;
}
