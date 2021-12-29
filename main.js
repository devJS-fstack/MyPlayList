const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $(".cd");
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");
const app = {
  currentSong: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Berlin",
      singer: "Khôi Vũ",
      path: "./audio/berlin.mp3",
      image: "https://i.ytimg.com/vi/6KCff8T5tR0/hqdefault.jpg",
    },
    {
      name: "Bông hoa chẳng thuộc về ta",
      singer: "Việt",
      path: "./audio/bonghoakhongthuocveta.mp3",
      image:
        "https://images.genius.com/9ad7ba2b1e1f0e675d8fcb68ab425e7f.951x1000x1.jpg",
    },
    {
      name: "Ex Party (feat. Ciara)",
      singer: "02 Summer Walker",
      path: "./audio/exparty.mp3",
      image: "https://i.ytimg.com/vi/R8uHzbbf1Cw/maxresdefault.jpg",
    },
    {
      name: "Ngày hôm nay của anh thế nào ",
      singer: "TÙA & FREAKY",
      path: "./audio/ngayhomnaythenao.mp3",
      image: "https://i.scdn.co/image/ab67616d0000b27360ac5a81734c54c1d7a1d7e8",
    },
    {
      name: "Nghe bài này đi em",
      singer: "Specter x Chu x Củ Cải",
      path: "./audio/nghebainaydiem.mp3",
      image: "https://i.ytimg.com/vi/i0lAt_BzfTM/maxresdefault.jpg",
    },
    {
      name: "Ngủ sớm đi em",
      singer: "Đức Minh",
      path: "./audio/nightstory.mp3",
      image: "https://i.ytimg.com/vi/wdQoVMlVMGY/maxresdefault.jpg",
    },
    {
      name: "Rapitalove EP| Tay To ",
      singer: "RPT MCK x RPT PhongKhin",
      path: "./audio/raplove.mp3",
      image:
        "https://i1.sndcdn.com/artworks-czy8O9rZntYWslfO-UftbKQ-t500x500.jpg",
    },
    {
      name: "Tương tư",
      singer: "CLOW X FLEPY",
      path: "./audio/tuongtu.mp3",
      image: "https://i1.sndcdn.com/artworks-000621581776-ybyyqa-t500x500.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song) => {
      return `<div class="song">
        <div
          class="thumb"
          style="
            background-image: url('${song.image}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentMusic", {
      get: () => this.songs[this.currentSong],
    });
  },

  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;
    // Scroll CD
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Handle CD
    // Handle CD
    const cdThumbAni = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 20000,
        iterations: Infinity,
      }
    );

    cdThumbAni.pause();
    // Click Btn Play
    playBtn.onclick = () => {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    audio.onplay = () => {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAni.play();
    };
    audio.onpause = () => {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAni.pause();
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    progress.onchange = (e) => {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    nextBtn.onclick = () => {
      if (_this.isRandom) _this.playRandomSong();
      else _this.nextSong();
      audio.play();
      const song = $$(".song");
      for (var i = 0; i < song.length; i++) {
        if (song[i].classList.contains("active")) {
          song[i].classList.remove("active");
          break;
        }
      }
      song[_this.currentSong].classList.add("active");
      _this.scrollToActiveSong();
    };
    prevBtn.onclick = () => {
      if (_this.isRandom) _this.playRandomSong();
      else _this.prevSong();
      audio.play();
      const song = $$(".song");
      for (var i = 0; i < song.length; i++) {
        if (song[i].classList.contains("active")) {
          song[i].classList.remove("active");
          break;
        }
      }
      song[_this.currentSong].classList.add("active");
    };

    randomBtn.onclick = (e) => {
      _this.isRandom = !_this.isRandom;
      _this.isRepeat = false;
      randomBtn.classList.toggle("active", _this.isRandom);
      repeatBtn.classList.remove("active");
    };

    // When repeat music

    repeatBtn.onclick = () => {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
      _this.isRandom = false;
      randomBtn.classList.remove("active");
    };

    // When audio finished

    audio.onended = () => {
      if (_this.isRepeat) {
        audio.play();
      } else nextBtn.click();
    };
  },

  activeListSong: function () {
    const song = $$(".song");
    song[this.currentSong].classList.add("active");
  },

  scrollToActiveSong: function () {
    const _this = this;
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: `${_this.currentSong <= 4 ? "center" : "nearest"}`,
      });
    }, 300);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentMusic.name;
    cdThumb.style.backgroundImage = `url(${this.currentMusic.image})`;
    audio.src = this.currentMusic.path;
  },

  nextSong: function () {
    this.currentSong++;
    if (this.currentSong >= this.songs.length) this.currentSong = 0;
    this.loadCurrentSong();
  },
  prevSong: function () {
    if (this.currentSong == 0) this.currentSong = this.songs.length - 1;
    else {
      this.currentSong--;
    }
    this.loadCurrentSong();
  },

  arrRandomIndex: [],

  playRandomSong: function () {
    let newIndex;
    if (this.arrRandomIndex.length == 0) {
      this.arrRandomIndex = [this.currentSong];
    }

    newIndex = Math.floor(Math.random() * this.songs.length);
    let i = 0;
    for (; i < this.arrRandomIndex.length; i++) {
      if (newIndex === this.arrRandomIndex[i]) {
        newIndex = Math.floor(Math.random() * this.songs.length);
        i = -1;
      }
    }
    if (this.arrRandomIndex.length == this.songs.length - 1) {
      this.arrRandomIndex = [newIndex];
    } else {
      this.arrRandomIndex.push(newIndex);
    }

    this.currentSong = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // define Property Object
    this.defineProperties();

    //Handle
    this.handleEvents();

    //Render playlist
    this.render();

    // Load Current Song
    this.loadCurrentSong();

    this.activeListSong();
  },
};

app.start();
