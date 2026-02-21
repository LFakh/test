import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { SearchInput } from "../search-input/search-input";
import styles from "./navbar.module.css";

export const Navbar = component$(() => {
  const isScrolled = useSignal(false);
  const isMobileMenuOpen = useSignal(false);

  useVisibleTask$(() => {
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 0;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <header class={`${styles.navbar} ${isScrolled.value ? styles.scrolled : styles.transparent}`}>
      <div class={styles.container}>
        <Link href="/" class={styles.logo}>
          <img
            src="/lotsoflex-logo.png"
            alt="Lotsoflex"
            width={120}
            height={32}
            class={styles.logo}
          />
        </Link>

        <nav class={styles.nav}>
          <ul class={styles.navList}>
            <li>
              <Link href="/" class={styles.navLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/tv-shows" class={styles.navLink}>
                TV Shows
              </Link>
            </li>
            <li>
              <Link href="/movies" class={styles.navLink}>
                Movies
              </Link>
            </li>
            <li>
              <Link href="/my-list" class={styles.navLink}>
                My List
              </Link>
            </li>
          </ul>
        </nav>

        <div class={styles.spacer}></div>

        <div class={styles.actions}>
          <SearchInput />
          <button class={styles.iconButton} aria-label="Notifications">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <div class={styles.profile}>
            <div class={styles.profileImage}></div>
            <svg class={styles.profileArrow} fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <button 
          class={styles.hamburger}
          onClick$={() => isMobileMenuOpen.value = !isMobileMenuOpen.value}
          aria-label="Toggle mobile menu"
        >
          <span class={styles.hamburgerLine}></span>
          <span class={styles.hamburgerLine}></span>
          <span class={styles.hamburgerLine}></span>
        </button>
      </div>

      {isMobileMenuOpen.value && (
        <div class={`${styles.mobileMenu} ${styles.open}`}>
          <ul class={styles.mobileNavList}>
            <li class={styles.mobileNavItem}>
              <Link href="/" class={styles.mobileNavLink} onClick$={() => isMobileMenuOpen.value = false}>
                Home
              </Link>
            </li>
            <li class={styles.mobileNavItem}>
              <Link href="/tv-shows" class={styles.mobileNavLink} onClick$={() => isMobileMenuOpen.value = false}>
                TV Shows
              </Link>
            </li>
            <li class={styles.mobileNavItem}>
              <Link href="/movies" class={styles.mobileNavLink} onClick$={() => isMobileMenuOpen.value = false}>
                Movies
              </Link>
            </li>
            <li class={styles.mobileNavItem}>
              <Link href="/my-list" class={styles.mobileNavLink} onClick$={() => isMobileMenuOpen.value = false}>
                My List
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
});