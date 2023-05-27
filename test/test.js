'use strict';
const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const passportStub = require('passport-stub');
const User = require('../models/user');
const Schedule = require('../models/schedule');
const Candidate = require('../models/candidate');
const Availability = require('../models/availability');

const setUp = () => {
  passportStub.install(app);
  passportStub.login({ id: 0, username: 'testuser' });
};

const tearDown = () => {
  passportStub.logout();
  passportStub.uninstall(app);
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
  beforeAll(() => {
    setUp();
  });
  afterAll(async () => {
    tearDown();
    // テストで作成したデータを削除
    const candidates = await Candidate.findAll({
      where: { scheduleId: scheduleId },
    });
    const promises = candidates.map(c => {
      return c.destroy();
    });
    await Promise.all(promises);
    const s = await Schedule.findByPk(scheduleId);
    await s.destroy();
  });

  test('予定が作成でき、表示される', async () => {
    await User.upsert({ userId: 0, username: 'testuser' });
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
    scheduleId = createdSchedulePath.split('/schedules/')[1];
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

describe('/schedules/:scheduleId/users/:userId/candidates/:candidateId', () => {
  beforeAll(() => { setUp(); });
  afterAll(() => { tearDown(); });

  test('出欠が更新できる', (done) => {
    User.upsert({ userId: 0, username: 'testuser' }).then(() => {
      request(app)
        .post('/schedules')
        .send({ scheduleName: 'テスト出欠更新予定1', memo: 'テスト出欠更新メモ1', candidates: 'テスト出欠更新候補1' })
        .end((err, res) => {
          const createdSchedulePath = res.headers.location;
          const [_, scheduleId] = createdSchedulePath.split('/schedules/');
          Candidate.findOne({
            where: { scheduleId: scheduleId }
          }).then((candidate) => {
            // 更新がされることをテスト
            const userId = 0;
            request(app)
              .post(`/schedules/${scheduleId}/users/${userId}/candidates/${candidate.candidateId}`)
              .send({ availability: 2 }) // 出席に更新
              .expect('{"status":"OK","availability":2}')
              .end((err, res) => {
                Availability.findAll({
                  where: { scheduleId: scheduleId }
                }).then((availabilities) => {
                  assert.strictEqual(availabilities.length, 1);
                  assert.strictEqual(availabilities[0].availability, 2);
                  deleteScheduleAggregate(scheduleId, done, err);
                });
              });
          });
        });
    });
  });
});

function deleteScheduleAggregate(scheduleId, done, err) {
  Availability.findAll({
    where: { scheduleId: scheduleId }
  }).then((availabilities) => {
    const promises = availabilities.map((a) => { return a.destroy(); });
    Promise.all(promises).then(() => {
      Candidate.findAll({
        where: { scheduleId: scheduleId }
      }).then((candidates) => {
        const promises = candidates.map((c) => { return c.destroy(); });
        Promise.all(promises).then(() => {
          Schedule.findByPk(scheduleId).then((s) => {
            s.destroy().then(() => {
              if (err) return done(err);
              done();
            });
          });
        });
      });
    });
  });
}
