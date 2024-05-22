'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: [ 'query' ] });

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
  afterAll(async() => {
    tearDown();
    // テストで作成したデータを削除
    await prisma.candidate.deleteMany({ where: { scheduleId } });
    await prisma.schedule.delete({ where: { scheduleId } });
  });

  test('予定が作成でき、表示される', async () => {
    const userId = 0, username = 'testuser';
    const data = { userId: userId, username: username };
    await prisma.user.upsert({
      where: { userId },
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

    const createdSchedulePath = res.headers.location;
    const [_, scheduleId0] = createdSchedulePath.split('/schedules/');
    scheduleId = scheduleId0;
    await request(app)
      .get(createdSchedulePath)
      .expect(/テスト予定1/)
      .expect(/テストメモ1/)
      .expect(/テストメモ2/)
      .expect(/テスト候補1/)
      .expect(/テスト候補2/)
      .expect(/テスト候補3/)
      .expect(200);
  });
});
