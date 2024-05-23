'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });

const TEST_USER = { userId: 0, username: 'testuser' };

const setUp = () => {
  passportStub.install(app);
  passportStub.login({ id: 0, username: 'testuser' });
};

const tearDown = () => {
  passportStub.logout();
  passportStub.uninstall();
};

describe('/login', () => {
  beforeAll(() => { setUp(); });
   afterAll(() => { tearDown(); });

  test('ログインのためのリンクが含まれる', async () => {
    await request(app)
      .get('/login')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<a href="\/auth\/github"/)
      .expect(200);
  });

  test('ログイン時はユーザー名が表示される', async () => {
    await request(app)
      .get('/login')
      .expect(/testuser/)
      .expect(200);
  });
});

describe('/logout', () => {
  test('/ にリダイレクトされる', async () => {
    await request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302);
  });
});

describe('/schedules', () => {
  let scheduleId = '';

  beforeAll(() => { setUp(); });
   afterAll(async () => {
    tearDown();
    await deleteScheduleAggregate(scheduleId);
  });

  test('予定が作成でき、表示される', async () => {
    const data = TEST_USER;

    await prisma.user.upsert({
      where: { userId: data.userId },
      create: data,
      update: data,
    });
    const res = await request(app)
      .post('/schedules')
      .send({
        scheduleName: 'テスト予定1',
        memo: 'テストメモ1\r\nテストメモ2',
        candidates: 'テスト候補1\r\nテスト候補2\r\nテスト候補3',
      })
      .expect('Location', /schedules/)
      .expect(302);
    scheduleId = getScheduleId(res.headers.location, '/schedules/');

    await request(app)
      .get(res.headers.location)
      .expect(/テスト予定1/)
      .expect(/テストメモ1/)
      .expect(/テストメモ2/)
      .expect(/テスト候補1/)
      .expect(/テスト候補2/)
      .expect(/テスト候補3/)
      .expect(200);
  });
});

describe('/schedules/:scheduleId/users/:userId/candidates/:candidateId', () => {
  let scheduleId = '';
  beforeAll(() => {
    setUp();
  });
  afterAll(async () => {
    tearDown();
    await deleteScheduleAggregate(scheduleId);
  });

  test('出欠が更新できる', async () => {
    const data = TEST_USER;

    await prisma.user.upsert({
      where: { userId: data.userId },
      create: data,
      update: data,
    });
    const res = await request(app)
    .post('/schedules').send({
      scheduleName: 'テスト出欠更新予定1',
      memo: 'テスト出欠更新メモ1',
      candidates: 'テスト出欠更新候補1',
    });
    scheduleId = getScheduleId(res.headers.location, '/schedules/');

    const candidate = await prisma.candidate.findFirst({
      where: { scheduleId },
    });
    // 更新がされることをテスト
    await request(app)
      .post(`/schedules/${scheduleId}/users/${data.userId}/candidates/${candidate.candidateId}`)
      .send({ availability: 2 }) // 出席に更新
      .expect('{"status":"OK","availability":2}');

    const availabilities = await prisma.availability.findMany({ where: { scheduleId } });
    expect(availabilities.length).toBe(1);
    expect(availabilities[0].availability).toBe(2);
  });
});

async function deleteScheduleAggregate(scheduleId) {
  await prisma.availability.deleteMany({ where: { scheduleId } });
  await prisma.candidate.deleteMany({ where: { scheduleId } });
  await prisma.schedule.delete({ where: { scheduleId } });
}

function getScheduleId(path, separator) {
  const [_, scheduleId] = path.split(separator);
  return scheduleId;
}
