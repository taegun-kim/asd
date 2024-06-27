const hotelData = {
    "status": "DONE",
    "total": "48",
    "data": [
        {"num": "1", "shop": "2월호텔 더시그니처 동성로점", "address": "대구광역시 중구 중앙대로81길 13, (동일동, 3~10층)", "tel": "053-257-9898", "korean_style": "0", "western_style": "76", "image": 'images/image1.jpg'},
        {"num": "2", "shop": "2월호텔 수성점", "address": "대구광역시 수성구 청수로 67, (중동)", "tel": "053-765-0600", "korean_style": "3", "western_style": "27", "image": 'images/image2.jpg'},
        {"num": "3", "shop": "2월호텔 대구앞산점", "address": "대구광역시 남구 대명로 235, (대명동)", "tel": "053-626-7001", "korean_style": "0", "western_style": "35", "image": 'images/image3.jpg'},
        {"num": "4", "shop": "2월호텔대구황금점", "address": "대구광역시 수성구 동대구로 165, (황금동)", "tel": "053-764-2200", "korean_style": "0", "western_style": "36", "image": 'images/image4.jpg'},
        {"num": "5", "shop": "SKY 호텔", "address": "대구광역시 달성군 논공읍 논공중앙로34길 42", "tel": "053-615-3987", "korean_style": "0", "western_style": "26", "image": 'images/image5.jpg'},
        {"num": "6", "shop": "그리고(grigo)", "address": "대구광역시 달서구 달서대로91길 20, (호산동)", "tel": "053-591-3377", "korean_style": "3", "western_style": "33", "image": 'images/image6.jpg'},
        {"num": "7", "shop": "넘버25 동성로점", "address": "대구광역시 중구 서성로 100, (수창동)", "tel": "053-424-0025", "korean_style": "30", "western_style": "0", "image": 'images/image7.jpg'},
        {"num": "8", "shop": "노리호텔", "address": "대구광역시 달서구 성서공단로15길 59, 지하1~지상6층 (호산동)", "tel": "053-582-8500", "korean_style": "0", "western_style": "36", "image": 'images/image8.jpg'},
        {"num": "9", "shop": "대구호텔 여기어때", "address": "대구광역시 서구 달서로 151, (비산동)", "tel": "053-557-5667", "korean_style": "0", "western_style": "50", "image": 'images/image9.jpg'},
        {"num": "10", "shop": "대구힐탑호텔", "address": "대구광역시 남구 두류공원로 97, (대명동)", "tel": "053-651-9700", "korean_style": "3", "western_style": "70", "image": 'images/image10.jpg'}
    ]
};

const selectedHotelIndexes = [];
let loggedInUser = null;

// 1. 호텔 추천
document.addEventListener("DOMContentLoaded", () => {

    function randomizeHotels() {
        while (selectedHotelIndexes.length < 6) {
            const randomIndex = Math.floor(Math.random() * hotelData.data.length);
            if (!selectedHotelIndexes.includes(randomIndex)) {
                selectedHotelIndexes.push(randomIndex);
            }
        }

        // 호텔 이미지를 변경하여 표시
        selectedHotelIndexes.forEach((index, i) => {
            const hotel = hotelData.data[index];
            const image = document.getElementById(`hotel${i + 1}`);
            const name = document.getElementById(`hotelName${i + 1}`);
            image.src = hotel.image; // 이미지 경로 지정
            image.alt = hotel.shop;
            name.textContent = hotel.shop; // 호텔 이름 지정
        });
    }

    randomizeHotels();
});

loginBtn.addEventListener('click', () => {
    const loginModel = document.getElementById('loginModel');
    const signupModel = document.getElementById('signupModel');
    const closeButtons = document.querySelectorAll('.close');
    const signupLink = document.getElementById('signupLink');

    loginBtn.onclick = () => {
        loginModel.style.display = "block";
    };

    signupLink.onclick = (e) => {
        e.preventDefault();
        loginModel.style.display = "none";
        signupModel.style.display = "block";
    };

    closeButtons.forEach(button => {
        button.onclick = () => {
            loginModel.style.display = "none";
            signupModel.style.display = "none";
        };
    });

    window.onclick = (event) => {
        if (event.target === loginModel) {
            loginModel.style.display = "none";
        } else if (event.target === signupModel) {
            signupModel.style.display = "none";
        }
    };

    // 로그인 폼 처리
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const url = 'https://taegun-kim.github.io/HotelReservation/:3000/login';
        const data = { username: username, password: password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('로그인에 실패하였습니다.');
            }

            const result = await response.json();
            alert("로그인 성공");
            loggedInUser = result.user;
            updateLoginStatus(result.user);
            fetchUserReservations(result.user.username);
        } catch (error) {
            console.error('로그인 오류:', error);
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;

        const url = 'https://port-0-node-express-lxxo8336e8ae8d43.sel5.cloudtype.app/signup'; // 수정 필요: 백엔드 회원가입 엔드포인트 URL
        const data = { username: newUsername, password: newPassword };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('회원가입에 실패하였습니다.');
            }

            const result = await response.json();
            alert('회원가입이 성공적으로 완료되었습니다!');
        } catch (error) {
            console.error('회원가입 오류:', error);
        }
    });

    function updateLoginStatus(user) {
        const userNav = document.getElementById('userNav');
        userNav.innerHTML = `<li><a href="#" id="userBtn">${user.username}님</a></li>`;
        const userBtn = document.getElementById('userBtn');
        userBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetchUserReservations(user.username);
        });

        // Show reservations section only when user is logged in
        const reservationsSection = document.getElementById('userReservations');
        reservationsSection.style.display = 'block';
    }

    async function fetchUserReservations(username) {
        const url = `https://port-0-node-express-lxxo8336e8ae8d43.sel5.cloudtype.app/user/${username}/reservations`; // 수정 필요: 백엔드 예약 조회 엔드포인트 URL

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('예약 정보를 불러오는데 실패하였습니다.');
            }

            const reservations = await response.json();
            const reservationList = document.getElementById('reservationList');
            reservationList.innerHTML = '';

            if (reservations.length === 0) {
                reservationList.innerHTML = '<li>예약된 내역이 없습니다.</li>';
            } else {
                reservations.forEach(reservation => {
                    const li = document.createElement('li');
                    li.textContent = `예약 ID: ${reservation.id}, 예약 날짜: ${reservation.reserveStartDate} - ${reservation.reserveEndDate} , 예약자: ${reservation.reserveName} , 예약 인원: ${reservation.reserveGuests}`;
                    reservationList.appendChild(li);
                });
            }
        } catch (error) {
            console.error('예약 정보 불러오기 오류:', error);
        }
    }

// 예약 모달 열기
function openReserveModal(hotelIndex) {
    if (!loggedInUser) {
        alert('예약하려면 먼저 로그인해야 합니다.');
        return;
    }

    const reserveModal = document.getElementById('reserveModal');
    reserveModal.style.display = 'block';

    const hotelIdInput = document.getElementById('hotelId');
    hotelIdInput.value = selectedHotelIndexes[hotelIndex - 1];
}

async function submitReservation() {
    const hotelId = document.getElementById('hotelId').value;
    const reserveName = document.getElementById('reserveName').value;
    const reserveGuests = document.getElementById('reserveGuests').value;
    const reserveStartDate = document.getElementById('reserveStartDate').value;
    const reserveEndDate = document.getElementById('reserveEndDate').value;

    const data = {
        hotelId,
        reserveName,
        reserveGuests,
        reserveStartDate,
        reserveEndDate,
        username: loggedInUser.username
    };

    const url = 'https://port-0-node-express-lxxo8336e8ae8d43.sel5.cloudtype.app/reserve'; // 수정 필요: 백엔드 예약 생성 엔드포인트 URL

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('예약을 완료하지 못했습니다.');
        }

        const result = await response.json();
        alert('예약이 완료되었습니다!');
        closeReserveModal();
    } catch (error) {
        console.error('예약 오류:', error);
    }
}

// 예약 모달 닫기
function closeReserveModal() {
    const reserveModal = document.getElementById('reserveModal');
    reserveModal.style.display = 'none';
}
