const liffId = "2007752050-PBy7ZBbe";

const options = {
  enableHighAccuracy: true, // 使用高精準度的資訊
  timeout: 5000, // 請求超時時間 (毫秒)
  maximumAge: 0 // 最長緩存時間
};

async function main() {
    await liff.init({ liffId });

    if (!liff.isLoggedIn()) {
        liff.login();
        return;
    }

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    today.toISOString();

    document.getElementById("datetime").innerText = `${today}`;

    const profile = await liff.getProfile();
    const accessToken = await liff.getAccessToken();

    document.getElementById("userId").innerText = `User ID: ${profile.userId}`;
    document.getElementById("userName").innerText = `User Name: ${profile.displayName}`;
    document.getElementById("userStatus").innerText = `User Status: ${profile.statusMessage}`;
    document.getElementById("accessToken").innerText = `AccessToken: ${accessToken}`;

    console.log(profile);


    if ("geolocation" in navigator) {
	    console.log('瀏覽器支援 Geolocation');
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    }
    else {
	    console.log('瀏覽器不支援 Geolocation');
      document.getElementById("latitude").innerText = `緯度: 無法取得資訊`;
      document.getElementById("longtitude").innerText = `經度: 無法取得資訊`;
    }
}

function successCallback(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  document.getElementById("latitude").innerText = `緯度: ${latitude}`;
  document.getElementById("longtitude").innerText = `經度: ${longitude}`;
  console.log(`緯度：${latitude}，經度：${longitude}`);
}

function errorCallback(error) {
  console.error(`錯誤：${error.message}`);
  document.getElementById("latitude").innerText = `緯度: 無法取得資訊`;
  document.getElementById("longtitude").innerText = `經度: 無法取得資訊`;
}


async function closeLiff() {
  try {
    liff.closeWindow();
  } catch(err) {
    console.log("error", err);
  }
}

async function submitInfo() {
  try {
    const profile = await liff.getProfile();

    const idNumber = document.getElementById("idNumber").value;
    const hiNumber = document.getElementById("hiNumber").value;
    const birthDate = document.getElementById("birthDate").value;

    await liff.sendMessages([
    {
      type: "text",
      text: `註冊綁定資訊:\nuserId: ${profile.userId}\n身分證字號:${idNumber}\n健保卡字號:${hiNumber}\n出生日期:${birthDate}`
    },
    ]);

    liff.closeWindow();

  } catch(err) {
    console.log("error", err);
  }
}


main();