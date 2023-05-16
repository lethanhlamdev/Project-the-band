const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "Tony Lee";

const playlist = $(".playlist");
const cd = $(".cd");
const heading = $(" header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Vet Mua",
            singer: "Vu Cat Tuong",
            path: "./asset/music/Vet Mua - Vu Cat Tuong.flac",
            image: "./asset/image/Vết mưa.jpg",
        },
        {
            name: "Ghe Qua",
            singer: "Dick x Tofu x PC",
            path: "./asset/music/Ghe Qua - Dick_ Tofu_ PC.flac",
            image: "./asset/image/Ghé qua.jpg",
        },
        {
            name: "Tron Tim",
            singer: "Den x MTV Band",
            path: "./asset/music/Tron Tim - Den_ MTV Band.flac",
            image: "./asset/image/Trốn tìm.jpg",
        },
        {
            name: "Blue Tequila",
            singer: "Tao",
            path: "./asset/music/Blue Tequila - Tao.flac",
            image: "./asset/image/Blue Tequila .jpeg",
        },
        {
            name: "Hong Kong 1",
            singer: "Nguyen Trong Tai x San Ji",
            path: "./asset/music/HongKong 1 - Nguyen Trong Tai_ San Ji_ D.flac",
            image: "./asset/image/Hôngkong.jpg",
        },
        {
            name: "Tam Ma",
            singer: " BlackBi x Vo Dinh Hi",
            path: "./asset/music/Tam Ma Tam Ma OST_ - BlackBi_ Vo Dinh Hi.flac",
            image: "./asset/image/Tâm ma.jpg",
        },
        {
            name: "Da Vu",
            singer: "Tang Duy Tan",
            path: "./asset/music/Da Vu - Tang Duy Tan.flac",
            image: "./asset/image/Dạ Vũ.jpeg",
        },
        {
            name: "Mot Ngay Mua Dong",
            singer: "Thuy Anh",
            path: "./asset/music/Mot Ngay Mua Dong.mp3",
            image: "./asset/image/Mọt ngày mùa đông.jpg",
        },
        {
            name: "Noi Dau Ngot Ngao",
            singer: "Thuy Anh",
            path: "./asset/music/Noi Dau Ngot Ngao.mp3",
            image: "./asset/image/Nôi đau ngọt ngào.jpg",
        },
        {
            name: "Vung Troi Binh Yen",
            singer: "Dinh Bao",
            path: "./asset/music/Vung Troi Binh Yen.mp3",
            image: "./asset/image/Vùng trời bình yên.jpg",
        },
        {
            name: "Troi Con Mua Mai",
            singer: "Ngoc Lan",
            path: "./asset/music/Troi Con Mua Mai.mp3",
            image: "./asset/image/Troi còn mưa mãi.jpg",
        },
    ],
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render() {
        const htmlS = this.songs.map((song, index) => {
            return `
                    <div class="song ${
                        index === this.currentIndex ? "active" : ""
                    }" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
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
        playlist.innerHTML = htmlS.join("");
    },

    defineProperties() {
        Object.defineProperty(this, "currentSong", {
            get() {
                return this.songs[this.currentIndex];
            },
        });
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    handleEvents() {
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        const cdWidth = cd.offsetWidth;
        document.onscroll = () => {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        playBtn.onclick = () => {
            if (this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        audio.onplay = () => {
            this.isPlaying = true;
            player.classList.add("playing");
            audio.play();
            cdThumbAnimate.play();
        };
        audio.onpause = () => {
            this.isPlaying = false;
            player.classList.remove("playing");
            audio.pause();
            cdThumbAnimate.pause();
        };

        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent =
                    (audio.currentTime / audio.duration) * 100;
                progress.value = progressPercent;
            }
        };
        progress.oninput = (e) => {
            if (audio.currentTime) {
                const seekTime = (audio.duration * e.target.value) / 100;
                audio.currentTime = seekTime;
            }
        };

        nextBtn.onclick = () => {
            if (this.isRandom) {
                this.playRandomSong();
            } else {
                this.nextSong();
            }
            this.render();
            this.scrollActiveSong();
            audio.play();
        };
        prevBtn.onclick = () => {
            if (this.isRandom) {
                this.playRandomSong();
            } else {
                this.prevSong();
            }
            this.render();
            this.scrollActiveSong();
            audio.play();
        };
        randomBtn.onclick = (e) => {
            this.isRandom = !this.isRandom;
            this.setConfig("isRandom", this.isRandom);
            randomBtn.classList.toggle("active", this.isRandom);
        };

        repeatBtn.onclick = (e) => {
            this.isRepeat = !this.isRepeat;
            this.setConfig("isRepeat", this.isRepeat);
            repeatBtn.classList.toggle("active", this.isRepeat);
        };
        audio.onended = () => {
            if (this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        playlist.onclick = (e) => {
            const songNode = e.target.closest(".song:not(.active)");
            const optionNode = e.target.closest(".option");
            if (songNode || optionNode) {
                if (songNode) {
                    this.currentIndex = Number(songNode.dataset.index);
                    this.loadCurrentSong();
                    this.render();
                    audio.play();
                }
                if (optionNode) {
                    alert(
                        "Coming Soon ! Tính năng này đang được nhà phát triển cập nhật, bạn có thể sử dụng tính năng này trong thời gian sắp tới."
                    );
                }
            }
        };
    },
    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    scrollActiveSong() {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 300);
    },

    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();

        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    },
};
app.start();
