/**
 * 유저 계정 데이터 이관 스크립트 (advent / dumpit)
 * 사용법: node scripts/migrate-user.js <service> <userName> [provider]
 * 예시: node scripts/migrate-user.js advent 김이나 kakao
 */
const mongoose = require('../apps/server/node_modules/mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://claw-addict:gR9wK2vT5mX8qP4zY7bN1s@claw-addict.shdh6c6.mongodb.net/haroo-box?appName=claw-addict';

function generateAdventSql(oldUserId, newUserId) {
  return `DO $$
DECLARE
  v_old_user_id UUID := '${oldUserId}';
  v_new_user_id UUID := '${newUserId}';
BEGIN
  -- 1. 신규 계정 빈 캘린더 충돌 방지 삭제
  DELETE FROM public.calendars WHERE owner_id = v_new_user_id;

  -- 2. 캘린더 소유권 이전
  UPDATE public.calendars SET owner_id = v_new_user_id WHERE owner_id = v_old_user_id;

  -- 3. 작성 메시지 이전
  UPDATE public.messages SET sender_id = v_new_user_id WHERE sender_id = v_old_user_id;

  -- 4. 캘린더 참여 기록 이전 (중복 방지)
  UPDATE public.calendar_participations
  SET sender_id = v_new_user_id
  WHERE sender_id = v_old_user_id
    AND calendar_id NOT IN (
      SELECT calendar_id FROM public.calendar_participations WHERE sender_id = v_new_user_id
    );
  DELETE FROM public.calendar_participations WHERE sender_id = v_old_user_id;

  -- 5. 이전 더미 계정 삭제
  DELETE FROM auth.users WHERE id = v_old_user_id;

  RAISE NOTICE '어드벤트 데이터 이관 완료: % -> %', v_old_user_id, v_new_user_id;
END $$;`;
}

function generateDumpitSql(oldUserId, newUserId) {
  return `DO $$
DECLARE
  v_old_user_id UUID := '${oldUserId}';
  v_new_user_id UUID := '${newUserId}';
BEGIN
  -- 1. 감쓰 작성글 이전
  UPDATE public.wastes SET author_id = v_new_user_id WHERE author_id = v_old_user_id;

  -- 2. 댓글 이전
  UPDATE public.ranking_comments SET author_id = v_new_user_id WHERE author_id = v_old_user_id;

  -- 3. 배달받은 편지함 이전
  UPDATE public.deliveries
  SET recipient_id = v_new_user_id
  WHERE recipient_id = v_old_user_id
    AND waste_id NOT IN (
      SELECT waste_id FROM public.deliveries WHERE recipient_id = v_new_user_id
    );
  DELETE FROM public.deliveries WHERE recipient_id = v_old_user_id;

  -- 4. 보충 배달 큐 이전
  UPDATE public.supplemental_delivery_queue
  SET recipient_id = v_new_user_id
  WHERE recipient_id = v_old_user_id
    AND waste_id NOT IN (
      SELECT waste_id FROM public.supplemental_delivery_queue WHERE recipient_id = v_new_user_id
    );
  DELETE FROM public.supplemental_delivery_queue WHERE recipient_id = v_old_user_id;

  -- 5. 세션 상태 정리
  DELETE FROM public.supplemental_delivery_state WHERE user_id = v_old_user_id;
  DELETE FROM public.presence_tabs WHERE user_id = v_old_user_id;

  -- 6. 이전 더미 계정 삭제
  DELETE FROM auth.users WHERE id = v_old_user_id;

  RAISE NOTICE '감쓰 데이터 이관 완료: % -> %', v_old_user_id, v_new_user_id;
END $$;`;
}

async function run() {
  const [,, service, userName, provider = 'kakao'] = process.argv;

  if (!service || !userName) {
    console.log('📌 사용법: node scripts/migrate-user.js <advent|dumpit> <이름> [kakao|google]');
    console.log('예시: node scripts/migrate-user.js advent 김이나 kakao');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.useDb('haroo-box');

  const users = await db.collection('users').find({
    service,
    name: userName,
    provider,
  }).sort({ createdAt: 1 }).toArray();

  if (users.length === 0) {
    console.log(`❌ '${userName}' 사용자를 찾을 수 없습니다. (서비스: ${service}, 로그인: ${provider})`);
    process.exit(1);
  }

  if (users.length === 1) {
    console.log(`ℹ️ '${userName}' 사용자의 계정이 1개만 조회되었습니다:`);
    console.log(`- ID: ${users[0].serviceUserId} (providerId: ${users[0].providerId}, 등록일: ${users[0].createdAt.toISOString()})`);
    console.log('👉 해당 지인이 통합 카카오 로그인을 1회 먼저 진행한 후 다시 실행해주세요.');
    process.exit(0);
  }

  const oldUser = users[0];
  const newUser = users[users.length - 1];

  console.log('======================================================');
  console.log(`✅ [${service.toUpperCase()}] '${userName}' 계정 매칭 성공!`);
  console.log(`- 이전 계정: ${oldUser.serviceUserId} (카카오: ${oldUser.providerId})`);
  console.log(`- 신규 계정: ${newUser.serviceUserId} (카카오: ${newUser.providerId})`);
  console.log('======================================================\n');

  console.log('📋 아래 SQL 쿼리를 Supabase SQL Editor에 복사하여 실행해주세요:\n');
  const sql = service === 'advent'
    ? generateAdventSql(oldUser.serviceUserId, newUser.serviceUserId)
    : generateDumpitSql(oldUser.serviceUserId, newUser.serviceUserId);

  console.log(sql);
  console.log('\n======================================================');

  // 안내 및 이전 몽고디비 레코드 삭제 여부 질문
  console.log('💡 SQL 실행 후 이전 MongoDB 레코드를 정리하려면 아래 명령어를 실행하세요:');
  console.log(`node -e "require('${__filename}').deleteOldMongoUser('${oldUser._id}')"`);
  process.exit(0);
}

module.exports.deleteOldMongoUser = async function(objectIdStr) {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.useDb('haroo-box');
  const { ObjectId } = mongoose.Types;
  await db.collection('users').deleteOne({ _id: new ObjectId(objectIdStr) });
  console.log(`✅ MongoDB 이전 레코드(${objectIdStr}) 삭제 완료!`);
  process.exit(0);
};

if (require.main === module) {
  run().catch((err) => {
    console.error('에러 발생:', err);
    process.exit(1);
  });
}

