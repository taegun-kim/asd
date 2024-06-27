const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors'); // CORS 패키지 추가

const app = express();
const port = 3000;

// Sequelize 연결 설정
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const corsOptions = {
    origin: 'https://taegun-kim.github.io/HotelReservation/', // 당신의 프론트엔드 출처로 업데이트
    methods: ['GET', 'POST'], // 필요한 HTTP 메서드 추가
    allowedHeaders: ['Content-Type', 'Authorization'] // 프론트엔드에서 보내는 헤더 추가
};

// Express 앱 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

let reservations = []; // 예약 정보를 담을 빈 배열 또는 초기화

// Reservation 모델 정의
const Reservation = sequelize.define('Reservation', {
    hotelId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reserveStartDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reserveEndDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reserveGuests: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reserveName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// 예약 테이블 생성
async function syncReservationDatabase() {
    try {
        await sequelize.authenticate();
        await Reservation.sync({ force: true }); // force: true로 설정하면 테이블을 강제로 재생성합니다.
        console.log('예약 테이블이 성공적으로 생성되었습니다.');
    } catch (error) {
        console.error('SQLite 연결 실패:', error);
    }
}

async function syncUserDatabase() {
    try {
        await sequelize.authenticate();
        await User.sync({ force: true }); // force: true로 설정하면 테이블을 강제로 재생성합니다.
        console.log('사용자 테이블이 성공적으로 생성되었습니다.');
    } catch (error) {
        console.error('SQLite 연결 실패:', error);
    }
}

syncUserDatabase();
syncReservationDatabase();

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.create({
            username: username,
            password: password
        });

        res.status(201).json({ message: '회원가입이 완료되었습니다.', user });
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        res.status(500).json({ error: '회원가입 중 오류 발생' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username: username } });

        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
        }

        res.status(200).json({ message: '로그인 성공', user });
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        res.status(500).json({ error: '로그인 중 오류 발생' });
    }
});

// 예약 처리 라우트
app.post('/reserve', async (req, res) => {
    const { hotelId, reserveStartDate, reserveEndDate, reserveGuests, reserveName, userName } = req.body;

    // 요청 데이터 검증
    if (!hotelId || !reserveStartDate || !reserveEndDate || !reserveGuests || !reserveName || !userName) {
        return res.status(400).json({ error: '모든 필드는 필수입니다.' });
    }

    try {
        const reservation = await Reservation.create({
            hotelId: hotelId,
            reserveStartDate: reserveStartDate,
            reserveEndDate: reserveEndDate,
            reserveGuests: reserveGuests,
            reserveName: reserveName,
            userName: userName
        });

        res.status(201).json({ message: `호텔 ${hotelId} 예약이 완료되었습니다.`, reservation });
    } catch (error) {
        console.error('예약 생성 중 오류 발생:', error);
        res.status(500).json({ error: '예약 생성 중 오류 발생' });
    }
});
app.get('/user/:username/reservations', async (req, res) => {
    try {
        // 로그인된 사용자의 username 가져오기
        const username = req.params.username; // 예시로 req.user.username 사용, 실제 구현에서는 세션 또는 토큰에서 가져온다고 가정

        // 사용자 정보 가져오기
        const user = await User.findOne({
            where: { username }
        });

        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 사용자의 예약 정보 가져오기
        const userReservations = await Reservation.findAll({
            where: { userName: username } // 예약 정보 중에서 해당 사용자의 id와 일치하는 것만 가져옴
        });

        res.json(userReservations);
    } catch (err) {
        console.error('Error fetching user reservations:', err);
        res.status(500).json({ error: '서버 오류 발생' });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log('서버가 http://localhost:${port} 에서 실행 중입니다.');
});