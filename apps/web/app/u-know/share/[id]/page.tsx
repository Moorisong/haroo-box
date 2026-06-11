import ShareContent from '@/contents/u-know/components/share-content';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UKnowSharePage({ params }: PageProps) {
  const { id } = await params;
  return <ShareContent token={id} />;
}
