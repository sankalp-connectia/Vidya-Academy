<?php
/**
 * Plugin Name: Vidya Academy Content Manager
 * Description: Edit the React website's navigation, footer, page text, images, buttons, and repeatable content from WordPress.
 * Version: 1.9.31
 * Author: Vidya Academy
 * Text Domain: vidya-academy-cms
 */

if (!defined('ABSPATH')) {
    exit;
}

define('VIDYA_CMS_VERSION', '1.9.31');
define('VIDYA_CMS_OPTION', 'vidya_academy_site_content');
define('VIDYA_CMS_BLOG_TYPE', 'vidya_blog');

function vidya_cms_defaults() {
    static $defaults = null;
    if ($defaults !== null) {
        return $defaults;
    }
    $json = file_get_contents(__DIR__ . '/defaults.json');
    $decoded = is_string($json) ? json_decode($json, true) : null;
    $defaults = is_array($decoded) ? $decoded : array();
    return $defaults;
}

/** Keep only the two photos rendered in the About page hero: the focus image and its inset detail. */
function vidya_cms_about_hero_images($images) {
    if (!is_array($images)) return array();
    $focus = null;
    $detail = null;
    foreach ($images as $image) {
        if (!is_array($image)) continue;
        if (!empty($image['focus']) && $focus === null) $focus = $image;
        if (isset($image['id']) && (string) $image['id'] === '02') $detail = $image;
    }
    if ($focus === null) $focus = $images[2] ?? ($images[0] ?? null);
    if ($detail === null || $detail === $focus) {
        foreach ($images as $image) {
            if (is_array($image) && $image !== $focus) { $detail = $image; break; }
        }
    }
    $hero = array();
    if (is_array($focus)) {
        $focus['focus'] = true;
        $hero[] = $focus;
    }
    if (is_array($detail) && $detail !== $focus) {
        unset($detail['focus']);
        $hero[] = $detail;
    }
    return array_slice($hero, 0, 2);
}

function vidya_cms_is_assoc($value) {
    if (!is_array($value)) {
        return false;
    }
    $index = 0;
    foreach (array_keys($value) as $key) {
        if ($key !== $index) {
            return true;
        }
        $index++;
    }
    return false;
}

function vidya_cms_merge_defaults($defaults, $saved) {
    if (!is_array($defaults) || !is_array($saved) || !vidya_cms_is_assoc($defaults) || !vidya_cms_is_assoc($saved)) {
        return $saved;
    }
    $merged = $defaults;
    foreach ($saved as $key => $value) {
        if (isset($defaults[$key]) && is_array($defaults[$key]) && is_array($value)
            && vidya_cms_is_assoc($defaults[$key]) && vidya_cms_is_assoc($value)) {
            $merged[$key] = vidya_cms_merge_defaults($defaults[$key], $value);
        } else {
            $merged[$key] = $value;
        }
    }
    return $merged;
}

function vidya_cms_fill_empty_media($content, $defaults, $field = '') {
    if (is_array($content)) {
        foreach ($content as $key => $value) {
            $fallback = null;
            if (is_array($defaults) && array_key_exists($key, $defaults)) {
                $fallback = $defaults[$key];
            } elseif (is_array($defaults) && is_numeric($key) && isset($defaults[0])) {
                $fallback = $defaults[0];
            }
            $content[$key] = vidya_cms_fill_empty_media($value, $fallback, (string) $key);
        }
        return $content;
    }

    if (is_string($defaults) && trim($defaults) !== ''
        && preg_match('/(src|image|photo|logo|poster|thumbnail|video|videoUrl)$/i', $field)) {
        if (!is_string($content) || trim($content) === '') return $defaults;

        // Replace old bundled logo/mascot paths with the current package paths.
        // Keep WordPress Media Library URLs and all other hosted URL overrides.
        $default_path = wp_parse_url($defaults, PHP_URL_PATH);
        $is_brand_or_mascot_default = is_string($default_path)
            && preg_match('#^/(brand|mascots)/#i', $default_path);
        $is_legacy_local_path = preg_match('#^/?(images|videos)/#i', trim($content));
        if ($is_brand_or_mascot_default && $is_legacy_local_path) return $defaults;

        $is_mascot_video_default = is_string($default_path)
            && preg_match('#^/mascot-doll(?:1)?\.(mp4|webm)$#i', $default_path);
        if ($is_mascot_video_default && $is_legacy_local_path) return $defaults;

        $content_path = wp_parse_url($content, PHP_URL_PATH);
        $is_old_mascot_default = strtolower($field) === 'mascotvideo'
            && ($content === '/mascot-doll.webm'
                || (is_string($content_path)
                    && strpos($content_path, '/vidya-academy-cms/assets/mascot-doll.webm') !== false));
        if ($is_old_mascot_default) return $defaults;
    }
    return $content;
}

function vidya_cms_legacy_school_photo_map() {
    static $photo_map = null;
    if ($photo_map !== null) return $photo_map;
    $json = file_get_contents(__DIR__ . '/legacy-school-photos.json');
    $decoded = is_string($json) ? json_decode($json, true) : null;
    $photo_map = is_array($decoded) ? $decoded : array();
    return $photo_map;
}

function vidya_cms_replace_legacy_stock_photos($content, $defaults, $page, $prefix = '') {
    if (is_array($content)) {
        foreach ($content as $key => $value) {
            $fallback = null;
            if (is_array($defaults) && array_key_exists($key, $defaults)) {
                $fallback = $defaults[$key];
            } elseif (is_array($defaults) && is_numeric($key) && isset($defaults[0])) {
                $fallback = $defaults[0];
            }
            $path = $prefix === '' ? (string) $key : $prefix . '.' . $key;
            $content[$key] = vidya_cms_replace_legacy_stock_photos($value, $fallback, $page, $path);
        }
        return $content;
    }

    if (!is_string($content) || !preg_match('#^https?://#i', $content)) return $content;
    $url = strtok($content, '?');
    $matches = vidya_cms_legacy_school_photo_map()[$page][$url] ?? array();
    foreach ($matches as $match) {
        if (isset($match['path'], $match['image']) && $match['path'] === $prefix) {
            return $match['image'];
        }
    }

    $is_stock_photo = preg_match('/unsplash\.com|istockphoto\.com|pexels\.com|pixabay\.com/i', $content);
    $is_media_field = preg_match('/image|photo|gallery|marquee|hero|logo|src|poster|thumbnail/i', $prefix);
    if (!$is_stock_photo || !$is_media_field) return $content;
    if (is_string($defaults) && preg_match('#^/(images|brand|mascots)/#i', $defaults)) return $defaults;
    return '/images/school/school-community.webp';
}

function vidya_cms_resolve_bundled_media_urls($value) {
    if (is_array($value)) {
        foreach ($value as $key => $child) {
            $value[$key] = vidya_cms_resolve_bundled_media_urls($child);
        }
        return $value;
    }
    if (!is_string($value) || trim($value) === '') return $value;

    // WordPress may store Media Library URLs as HTTP even when this request
    // is served over HTTPS. Upgrade same-site media URLs to avoid mixed
    // content blocking in the React frontend.
    if (is_ssl()
        && strtolower((string) wp_parse_url($value, PHP_URL_SCHEME)) === 'http'
        && strtolower((string) wp_parse_url($value, PHP_URL_HOST)) === strtolower((string) wp_parse_url(home_url(), PHP_URL_HOST))) {
        $value = set_url_scheme($value, 'https');
    }

    // Bundled design assets live in the React site's public folder. Keep the
    // relative path so the frontend serves them from its own origin; duplicating
    // the image and 19 MB hero video inside the plugin makes WordPress uploads
    // exceed common file-size limits and serves media from the wrong origin.
    return $value;
}

/** Replace a previously bundled default only when the saved value is still that exact default. */
function vidya_cms_migrate_default_media_path($content, $path, $old_value, $new_value) {
    if (!is_array($path) || empty($path)) return $content;
    $node =& $content;
    $last = array_pop($path);
    foreach ($path as $part) {
        if (!isset($node[$part]) || !is_array($node[$part])) {
            unset($node);
            return $content;
        }
        $node =& $node[$part];
    }
    if (isset($node[$last]) && is_string($node[$last]) && $node[$last] === $old_value) {
        $node[$last] = $new_value;
    }
    unset($node);
    return $content;
}

function vidya_cms_get_content() {
    $saved = get_option(VIDYA_CMS_OPTION, null);
    if (!is_array($saved)) {
        $legacy = get_option('vidya_headless_content', null);
        $saved = is_array($legacy) ? vidya_cms_merge_defaults(vidya_cms_defaults(), $legacy) : vidya_cms_defaults();
        add_option(VIDYA_CMS_OPTION, $saved, '', false);
    }
    // Remove the bundled demonstration entries from earlier plugin releases
    // once, leaving the CMS collections ready for the school to populate.
    $empty_collections_migration = 'vidya_cms_1_9_27_empty_collections_migrated';
    if (!get_option($empty_collections_migration, false)) {
        if (is_array($saved)) {
            if (!isset($saved['motionEvents']) || !is_array($saved['motionEvents'])) $saved['motionEvents'] = array();
            if (!isset($saved['motionAchievements']) || !is_array($saved['motionAchievements'])) $saved['motionAchievements'] = array();
            if (!isset($saved['blogs']) || !is_array($saved['blogs'])) $saved['blogs'] = array();
            $saved['motionEvents']['events'] = array();
            $saved['motionAchievements']['achievements'] = array();
            $saved['blogs']['blogs'] = array();
            $saved['seoLandingPages'] = array();
            update_option(VIDYA_CMS_OPTION, $saved, false);
        }
        update_option($empty_collections_migration, 1, false);
    }
    // Expand the former three homepage class cards without losing the first
    // two cards' WordPress edits.
    $program_cards_migration = 'vidya_cms_1_9_28_program_cards_migrated';
    if (!get_option($program_cards_migration, false)) {
        $default_programs = vidya_cms_defaults()['home']['programs'] ?? array();
        if (!isset($saved['home']) || !is_array($saved['home'])) $saved['home'] = array();
        $programs = $saved['home']['programs'] ?? array();
        if (!is_array($programs) || count($programs) < 3) $programs = $default_programs;
        if (isset($programs[2]) && isset($default_programs[2])) {
            $programs[2] = array_merge($default_programs[2], is_array($programs[2]) ? $programs[2] : array());
            $programs[2]['title'] = 'Classes 1–5';
            $programs[2]['image'] = '/images/school/teacher-at-board.webp';
        }
        if (!isset($programs[3])) {
            $programs[3] = $default_programs[3] ?? array(
                'id' => 4,
                'title' => 'Classes 6–8',
                'age' => 'Middle classes',
                'href' => '/learning-pathways#senior-school',
                'image' => '/images/school/students-in-corridor.webp',
                'mobileImage' => '',
            );
        } else {
            $programs[3]['title'] = 'Classes 6–8';
            $programs[3]['image'] = '/images/school/students-in-corridor.webp';
        }
        $saved['home']['programs'] = array_values($programs);
        update_option(VIDYA_CMS_OPTION, $saved, false);
        update_option($program_cards_migration, 1, false);
    }
    // Replace the first release's disclosure placeholders with the verified
    // school information supplied for the in-site public disclosure page.
    $disclosure_migration = 'vidya_cms_1_9_29_disclosure_migrated';
    if (!get_option($disclosure_migration, false)) {
        $disclosure_defaults = vidya_cms_defaults()['mandatoryDisclosure'] ?? null;
        if (is_array($disclosure_defaults) && is_array($saved)) {
            $saved['mandatoryDisclosure'] = $disclosure_defaults;
            update_option(VIDYA_CMS_OPTION, $saved, false);
        }
        update_option($disclosure_migration, 1, false);
    }
    $content = vidya_cms_merge_defaults(vidya_cms_defaults(), $saved);
    // Remove the former eyebrow field from older Campus content so the admin
    // editor and public React page use the heading and description only.
    if (isset($content['campus']['upcomingCampus']) && is_array($content['campus']['upcomingCampus'])) {
        unset($content['campus']['upcomingCampus']['eyebrow']);
    }
    // Convert the former off-site disclosure link to the in-site page and
    // keep it available when older saved navigation replaces plugin defaults.
    if (isset($content['siteNavigation']['navbarData']) && is_array($content['siteNavigation']['navbarData'])) {
        $links = $content['siteNavigation']['navbarData']['links'] ?? array();
        if (!is_array($links)) $links = array();
        $has_disclosure = false;
        foreach ($links as &$link) {
            if (is_array($link) && (
                (isset($link['to']) && $link['to'] === 'https://vidyaacademy.school.in/mandatory-public-disclosure/')
                || (isset($link['label']) && strtolower($link['label']) === 'mandatory disclosure')
            )) {
                $link['label'] = 'MANDATORY DISCLOSURE';
                $link['to'] = '/mandatory-disclosure';
                unset($link['external']);
                $has_disclosure = true;
            }
        }
        unset($link);
        if (!$has_disclosure) {
            $links[] = array(
                'label' => 'MANDATORY DISCLOSURE',
                'to' => '/mandatory-disclosure',
            );
        }
        $content['siteNavigation']['navbarData']['links'] = $links;
    }
    // Move older bundled defaults to the new plugin media package while
    // preserving every image or video URL selected by an editor in WordPress.
    $default_media_migrations = array(
        array(array('home', 'homeCopy', 'hero', 'video'), '/videos/vidya-hero.mp4', '/media/home-hero-original.mp4'),
        array(array('about', 'aboutImages', 0, 'src'), '/images/heroes/about/desktop.webp', '/media/about/IMG_5972-Desktop-1920x1080.jpg'),
        array(array('about', 'aboutImages', 0, 'mobileImage'), '/images/heroes/about/mobile.webp', '/media/about/IMG_5972-Mobile-900x1600.jpg'),
        array(array('campus', 'heroImages', 4, 'src'), '/images/heroes/campus/desktop.webp', '/media/vidya-campus-desktop-1920x1080.jpg'),
        array(array('campus', 'heroImages', 4, 'mobileImage'), '/images/heroes/campus/mobile.webp', '/media/vidya-campus-mobile-900x1600.jpg'),
        array(array('campus', 'campusFeatureImage'), '/images/school/covered-activity-court.webp', '/media/IMG_5963-Campus-Feature-1600x1000.jpg'),
        array(array('motion', 'heroEvent', 'image'), '/images/heroes/motion/desktop.webp', '/media/milestone/milestone-hero-desktop-1920x1080.jpg'),
        array(array('motion', 'heroEvent', 'mobileImage'), '/images/heroes/motion/mobile.webp', '/media/milestone/milestone-hero-mobile-900x1600.jpg'),
        array(array('campus', 'groundsImages', 0, 'src'), '/images/school/climbing-wall.webp', '/media/student-photos/IMG_5949.jpg'),
        array(array('campus', 'groundsImages', 1, 'src'), '/images/school/preschool-ride-on.webp', '/media/student-photos/IMG_5953.jpg'),
        array(array('campus', 'groundsImages', 2, 'src'), '/images/school/outdoor-group-play.webp', '/media/student-photos/IMG_5962.jpg'),
        array(array('campus', 'groundsImages', 3, 'src'), '/images/school/playground-ride-on.webp', '/media/student-photos/IMG_5970.jpg'),
        array(array('campus', 'groundsImages', 4, 'src'), '/images/school/cricket-court.webp', '/media/IMG_5677-enhanced-1600x1000.png'),
        array(array('campus', 'groundsImages', 5, 'src'), '/images/school/activity-walkway.webp', '/media/school-photos/IMG_5697.jpg'),
        array(array('campus', 'groundsImages', 6, 'src'), '/images/school/students-at-school-gate.webp', '/media/school-photos/IMG_5714.jpg'),
        array(array('campus', 'buildingImages', 0, 'src'), '/images/school/academy-entrance-sign.webp', '/media/school-photos/IMG_5719.jpg'),
        array(array('campus', 'buildingImages', 1, 'src'), '/images/school/campus-arched-door.webp', '/media/school-photos/IMG_5950.jpg'),
        array(array('campus', 'buildingImages', 2, 'src'), '/images/school/academy-wall-sign.webp', '/media/school-photos/IMG_5956.jpg'),
        array(array('campus', 'buildingImages', 3, 'src'), '/images/school/classroom-teacher.webp', '/media/school-photos/IMG_5965.jpg'),
        array(array('campus', 'buildingImages', 4, 'src'), '/images/school/student-group-meeting.webp', '/media/school-photos/IMG_5966.jpg'),
        array(array('campus', 'buildingImages', 5, 'src'), '/images/school/student-guidance.webp', '/media/school-photos/IMG_5972.jpg'),
        array(array('campus', 'buildingImages', 6, 'src'), '/images/school/students-in-corridor.webp', '/media/school-photos/IMG_5697.jpg')
    );
    foreach ($default_media_migrations as $migration) {
        $content = vidya_cms_migrate_default_media_path($content, $migration[0], $migration[1], $migration[2]);
    }
    if (isset($content['about']) && is_array($content['about'])) {
        $content['about']['aboutImages'] = vidya_cms_about_hero_images($content['about']['aboutImages'] ?? array());
    }
    // Add new SEO template fields to existing saved page records without
    // replacing any content that site owners have already entered.
    if (isset($content['seoLandingPages']) && is_array($content['seoLandingPages'])) {
        foreach ($content['seoLandingPages'] as &$seo_page) {
            if (!is_array($seo_page)) continue;
            if (!array_key_exists('templateStyle', $seo_page)) $seo_page['templateStyle'] = 'classic';
            if (!array_key_exists('contentHtml', $seo_page)) $seo_page['contentHtml'] = '';
            if (!array_key_exists('customCss', $seo_page)) $seo_page['customCss'] = '';
            $seo_page['contentHtml'] = wp_kses_post($seo_page['contentHtml']);
            $seo_page['customCss'] = vidya_cms_sanitize_custom_css($seo_page['customCss']);
        }
        unset($seo_page);
    }
    if (isset($content['blogs']['blogsPage']) && is_array($content['blogs']['blogsPage'])) {
        $content['blogs']['blogsPage']['contentHtml'] = wp_kses_post($content['blogs']['blogsPage']['contentHtml'] ?? '');
        $content['blogs']['blogsPage']['customCss'] = vidya_cms_sanitize_custom_css($content['blogs']['blogsPage']['customCss'] ?? '');
    }
    $content = vidya_cms_fill_empty_media($content, vidya_cms_defaults());
    // Existing saved page fields override plugin defaults. Convert the known
    // legacy stock-photo URLs to bundled public photos before the CMS editor
    // and public API receive them. User-uploaded WordPress media stays intact.
    $defaults = vidya_cms_defaults();
    foreach ($content as $page_key => $page_content) {
        $page_defaults = isset($defaults[$page_key]) ? $defaults[$page_key] : null;
        $content[$page_key] = vidya_cms_replace_legacy_stock_photos($page_content, $page_defaults, (string) $page_key);
    }
    // The back-to-top mascot is video-only. Drop the old still poster field
    // from saved settings and the admin editor.
    if (isset($content['siteNavigation']['footerCopy']) && is_array($content['siteNavigation']['footerCopy'])) {
        unset($content['siteNavigation']['footerCopy']['mascotPosterImage']);
    }
    // Restore bundled campus photos where older saved records have blank image
    // slots. An entirely empty gallery uses the full local default set.
    foreach (array('marqueeImages', 'groundsImages', 'buildingMarqueeImages', 'buildingImages') as $campus_image_key) {
        $fallback_images = isset($defaults['campus'][$campus_image_key]) && is_array($defaults['campus'][$campus_image_key])
            ? $defaults['campus'][$campus_image_key]
            : array();
        if (empty($content['campus'][$campus_image_key]) || !is_array($content['campus'][$campus_image_key])) {
            $content['campus'][$campus_image_key] = $fallback_images;
            continue;
        }
        foreach ($fallback_images as $index => $fallback_image) {
            if (!isset($content['campus'][$campus_image_key][$index])) continue;
            $saved_image = $content['campus'][$campus_image_key][$index];
            if (is_string($fallback_image)) {
                if (!is_string($saved_image) || trim($saved_image) === '') {
                    $content['campus'][$campus_image_key][$index] = $fallback_image;
                }
            } elseif (is_array($fallback_image) && is_array($saved_image)
                && (!isset($saved_image['src']) || !is_string($saved_image['src']) || trim($saved_image['src']) === '')) {
                $content['campus'][$campus_image_key][$index] = array_merge($fallback_image, $saved_image);
                $content['campus'][$campus_image_key][$index]['src'] = $fallback_image['src'] ?? '';
            }
        }
    }
    // Keep shared mascot and logo assets bundled as editable WordPress defaults.
    $bundled_assets = array(
        array(array('siteNavigation', 'navbarData', 'logo', 'src'), '/brand/vidya-academy-navbar.png'),
        array(array('siteNavigation', 'footerCopy', 'mascotVideo'), '/mascot-doll1.webm'),
        array(array('home', 'homeCopy', 'hero', 'introLogoImage'), '/brand/vidya-logo-transparent.png'),
        array(array('home', 'homeCopy', 'faq', 'mascotImage'), '/mascots/vidya-mascot.webp'),
        array(array('home', 'homeCopy', 'learningPillarsLogo', 'image'), '/brand/trividha-shikshana.webp'),
        array(array('admissions', 'admissionsPage', 'hero', 'image'), '/mascots/vidya-admission-mascot.png'),
    );
    foreach ($bundled_assets as $asset) {
        $node =& $content;
        $asset_path = $asset[0];
        $field = array_pop($asset_path);
        foreach ($asset_path as $part) {
            if (!isset($node[$part]) || !is_array($node[$part])) $node[$part] = array();
            $node =& $node[$part];
        }
        if (empty($node[$field])) $node[$field] = $asset[1];
        unset($node);
    }
    if (isset($content['home']['homeCopy']['learningPillars']) && is_array($content['home']['homeCopy']['learningPillars'])) {
        foreach (array('mascot-body.png', 'mascot-mind.png', 'mascot-heart.png') as $index => $filename) {
            if (isset($content['home']['homeCopy']['learningPillars'][$index]) && empty($content['home']['homeCopy']['learningPillars'][$index]['image'])) {
                $content['home']['homeCopy']['learningPillars'][$index]['image'] = '/mascots/' . $filename;
            }
        }
    }
    // Regular homepage cards use one responsive image. Remove the obsolete
    // per-card phone crop fields so only hero images expose mobile variants.
    if (isset($content['home']) && is_array($content['home'])) {
        $home =& $content['home'];
        $image_lists = array('galleryImages', 'programs', 'lifeCards', 'wayItems', 'facts');
        foreach ($image_lists as $list_key) {
            if (!isset($home[$list_key]) || !is_array($home[$list_key])) continue;
            foreach ($home[$list_key] as &$item) {
                if (is_array($item)) unset($item['mobileImage']);
            }
            unset($item);
        }
        if (isset($home['homeCopy']['learningPillars']) && is_array($home['homeCopy']['learningPillars'])) {
            foreach ($home['homeCopy']['learningPillars'] as &$item) {
                if (is_array($item)) unset($item['mobileImage']);
            }
            unset($item);
        }
        unset($home);
    }
    // Only the actual About/Campus hero image keeps a phone crop. All other
    // entries in these mixed photo lists use one responsive desktop image.
    foreach (array('campus' => 'heroImages', 'about' => 'aboutImages') as $section_key => $list_key) {
        if (!isset($content[$section_key][$list_key]) || !is_array($content[$section_key][$list_key])) continue;
        $hero_flag = $section_key === 'campus' ? 'center' : 'focus';
        $hero_index = null;
        foreach ($content[$section_key][$list_key] as $index => $candidate) {
            if (is_array($candidate) && !empty($candidate[$hero_flag])) {
                $hero_index = $index;
                break;
            }
        }
        if ($hero_index === null && !empty($content[$section_key][$list_key])) {
            $hero_index = $section_key === 'campus' && count($content[$section_key][$list_key]) > 4 ? 4 : 0;
        }
        foreach ($content[$section_key][$list_key] as $index => &$item) {
            if (!is_array($item)) continue;
            if ((string) $index === (string) $hero_index) {
                if (!array_key_exists('mobileImage', $item)) $item['mobileImage'] = '';
            } else {
                unset($item['mobileImage']);
            }
        }
        unset($item);
    }
    // Older installs stored the Motion-In hero as a bare image URL. Migrate it
    // to the current object shape while keeping that saved URL as the desktop image.
    if (isset($content['motion']) && is_array($content['motion'])) {
        $motion_hero = $content['motion']['heroEvent'] ?? null;
        if (!is_array($motion_hero)) {
            $defaults = vidya_cms_defaults();
            $hero_default = $defaults['motion']['heroEvent'] ?? array();
            if (is_string($motion_hero) && $motion_hero !== '') {
                $hero_default['image'] = $motion_hero;
            }
            $content['motion']['heroEvent'] = $hero_default;
        } else {
            $content['motion']['heroEvent'] += array('mobileImage' => '');
        }
    }
    if (isset($content['siteNavigation']['footerColumns']) && is_array($content['siteNavigation']['footerColumns'])) {
        foreach ($content['siteNavigation']['footerColumns'] as &$column) {
            if (!is_array($column) || !isset($column['title']) || $column['title'] !== 'Admissions' || !isset($column['links']) || !is_array($column['links'])) {
                continue;
            }
            $has_blog_link = false;
            foreach ($column['links'] as $link) {
                if (isset($link['to']) && $link['to'] === '/blogs') {
                    $has_blog_link = true;
                    break;
                }
            }
            if (!$has_blog_link) {
                $column['links'][] = array('label' => 'Blogs', 'to' => '/blogs');
            }
        }
        unset($column);
    }
    foreach (array('motionEvents' => 'events', 'motionAchievements' => 'achievements') as $page_key => $list_key) {
        if (!isset($content[$page_key][$list_key]) || !is_array($content[$page_key][$list_key])) {
            continue;
        }
        foreach ($content[$page_key][$list_key] as &$item) {
            if (!is_array($item)) continue;
            if (!array_key_exists('bulletPoints', $item)) $item['bulletPoints'] = array();
            if (!array_key_exists('mobileImage', $item)) $item['mobileImage'] = '';
            if (!array_key_exists('galleryTitle', $item)) $item['galleryTitle'] = '';
        }
        unset($item);
    }
    // Serve bundled logos and mascots from the plugin itself. This keeps the
    // path valid in WordPress previews and on the React site on a separate host.
    $content = vidya_cms_resolve_bundled_media_urls($content);
    return $content;
}

function vidya_cms_get_public_content() {
    $content = vidya_cms_get_content();
    $collections = array(
        array('motionEvents', 'events'),
        array('motionAchievements', 'achievements'),
        array('home', 'faqItems'),
        array('', 'seoLandingPages'),
    );
    foreach ($collections as $path) {
        list($section, $list_key) = $path;
        if ($section !== '' && !isset($content[$section][$list_key])) continue;
        $collection = $section === '' ? ($content[$list_key] ?? null) : ($content[$section][$list_key] ?? null);
        if (!is_array($collection)) continue;
        $filtered = array_values(array_filter($collection, function ($item) {
            return is_array($item) && (!isset($item['status']) || $item['status'] !== 'draft');
        }));
        foreach ($filtered as &$item) {
            unset($item['status']);
        }
        unset($item);
        if ($section === '') $content[$list_key] = $filtered;
        else $content[$section][$list_key] = $filtered;
    }
    return $content;
}

function vidya_cms_activate() {
    if (get_option(VIDYA_CMS_OPTION, false) === false) {
        $legacy = get_option('vidya_headless_content', null);
        $content = is_array($legacy) ? vidya_cms_merge_defaults(vidya_cms_defaults(), $legacy) : vidya_cms_defaults();
        add_option(VIDYA_CMS_OPTION, $content, '', false);
    }
}
register_activation_hook(__FILE__, 'vidya_cms_activate');

function vidya_cms_register_blog_type() {
    register_post_type(VIDYA_CMS_BLOG_TYPE, array(
        'labels' => array(
            'name' => 'Vidya Blogs',
            'singular_name' => 'Vidya Blog',
        ),
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => false,
        'show_in_rest' => false,
        'show_in_nav_menus' => false,
        'rewrite' => false,
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions'),
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ));
}
add_action('init', 'vidya_cms_register_blog_type');

add_action('rest_api_init', function () {
    register_rest_route('vidya/v1', '/content', array(
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => function () {
            return rest_ensure_response(array(
                'version' => VIDYA_CMS_VERSION,
                'updatedAt' => get_option('vidya_academy_content_updated_at', ''),
                'content' => vidya_cms_get_public_content(),
            ));
        },
    ));

    register_rest_route('vidya/v1', '/seo-pages/(?P<slug>[a-z0-9-]+)', array(
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => 'vidya_cms_rest_seo_page',
        'args' => array('slug' => array('required' => true, 'sanitize_callback' => 'sanitize_title')),
    ));

    register_rest_route('vidya/v1', '/blogs', array(
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => 'vidya_cms_rest_blogs',
        'args' => array(
            'page' => array('default' => 1, 'sanitize_callback' => 'absint'),
            'per_page' => array('default' => 100, 'sanitize_callback' => 'absint'),
        ),
    ));

    register_rest_route('vidya/v1', '/enquiry', array(
        'methods' => WP_REST_Server::CREATABLE,
        'permission_callback' => '__return_true',
        'callback' => 'vidya_cms_receive_enquiry',
        'args' => array(
            'name' => array('required' => true, 'type' => 'string'),
            'phone' => array('required' => true, 'type' => 'string'),
            'email' => array('required' => true, 'type' => 'string'),
        ),
    ));
});

function vidya_cms_rest_seo_page(WP_REST_Request $request) {
    $slug = sanitize_title($request->get_param('slug'));
    $pages = vidya_cms_get_public_content()['seoLandingPages'] ?? array();
    foreach ($pages as $page) {
        if (!is_array($page) || ($page['slug'] ?? '') !== $slug) continue;
        $page['metaTitle'] = sanitize_text_field($page['metaTitle'] ?? ($page['seoTitle'] ?? ''));
        $page['seoTitle'] = $page['metaTitle'];
        $page['metaDescription'] = sanitize_textarea_field($page['metaDescription'] ?? '');
        $page['contentHtml'] = wp_kses_post($page['contentHtml'] ?? '');
        $page['customCss'] = vidya_cms_sanitize_custom_css($page['customCss'] ?? '');
        return rest_ensure_response($page);
    }
    return new WP_Error('vidya_seo_page_not_found', 'SEO landing page not found.', array('status' => 404));
}

function vidya_cms_sanitize_custom_css($css) {
    if (!is_string($css)) return '';
    $css = wp_check_invalid_utf8($css);
    $css = preg_replace('#@import\\s+(?:url\\()?[^;]+;?#i', '', $css);
    $css = preg_replace('#(?:expression\\s*\\(|javascript\\s*:|vbscript\\s*:|-moz-binding\\s*:|behavior\\s*:)#i', '', $css);
    $css = preg_replace_callback('#url\(\s*("|\x27)?(.*?)\1\s*\)#i', function ($match) {
        $url = trim($match[2]);
        if ($url === '' || preg_match('#^(https?://|/|\\./|\\.\\./|data:image/(?:png|gif|jpe?g|webp);base64,)#i', $url)) {
            return 'url(' . $match[1] . esc_url_raw($url) . $match[1] . ')';
        }
        return 'none';
    }, $css);
    return sanitize_textarea_field($css);
}

function vidya_cms_rest_blogs(WP_REST_Request $request) {
    $page = max(1, absint($request->get_param('page')));
    $per_page = min(100, max(1, absint($request->get_param('per_page'))));
    $query = new WP_Query(array(
        'post_type' => VIDYA_CMS_BLOG_TYPE,
        'post_status' => 'publish',
        'posts_per_page' => $per_page,
        'paged' => $page,
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => false,
        'ignore_sticky_posts' => true,
    ));
    $blogs = array();
    foreach ($query->posts as $post) {
        $image_id = get_post_thumbnail_id($post->ID);
        $mobile_image_id = absint(get_post_meta($post->ID, '_vidya_blog_mobile_image_id', true));
        $image_alt = get_post_meta($post->ID, '_vidya_blog_image_alt', true);
        if ($image_alt === '' && $image_id) {
            $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
        }
        $blogs[] = array(
            'slug' => $post->post_name,
            'title' => get_the_title($post),
            'description' => get_the_excerpt($post),
            'metaTitle' => sanitize_text_field(get_post_meta($post->ID, '_vidya_blog_meta_title', true)),
            'metaDescription' => sanitize_textarea_field(get_post_meta($post->ID, '_vidya_blog_meta_description', true)),
            'image' => $image_id ? vidya_cms_resolve_bundled_media_urls((string) wp_get_attachment_image_url($image_id, 'large')) : '',
            'mobileImage' => $mobile_image_id && wp_attachment_is_image($mobile_image_id) ? vidya_cms_resolve_bundled_media_urls((string) wp_get_attachment_image_url($mobile_image_id, 'large')) : '',
            'imageAlt' => sanitize_text_field($image_alt),
            'imageHeading' => sanitize_text_field(get_post_meta($post->ID, '_vidya_blog_image_heading', true)),
            'imageCaption' => sanitize_text_field(get_post_meta($post->ID, '_vidya_blog_image_caption', true)),
            'galleryTitle' => sanitize_text_field(get_post_meta($post->ID, '_vidya_blog_gallery_title', true)),
            'gallery' => vidya_cms_clean_story_gallery(get_post_meta($post->ID, '_vidya_blog_gallery', true)),
            'customHtml' => wp_kses_post(get_post_meta($post->ID, '_vidya_blog_custom_html', true)),
            'customCss' => vidya_cms_sanitize_custom_css(get_post_meta($post->ID, '_vidya_blog_custom_css', true)),
            'publishedAt' => get_post_time('c', true, $post),
            'contentHtml' => wp_kses_post(apply_filters('the_content', $post->post_content)),
        );
    }
    wp_reset_postdata();
    return rest_ensure_response(array(
        'blogs' => $blogs,
        'page' => $page,
        'perPage' => $per_page,
        'total' => (int) $query->found_posts,
        'totalPages' => (int) $query->max_num_pages,
    ));
}

function vidya_cms_receive_enquiry(WP_REST_Request $request) {
    $data = $request->get_json_params();
    if (!is_array($data)) {
        return new WP_Error('vidya_enquiry_invalid', 'Please check the form and try again.', array('status' => 400));
    }

    // Silently accept bot submissions without sending mail.
    if (!empty($data['website'])) {
        return rest_ensure_response(array('success' => true, 'message' => 'Thank you. Your enquiry has been sent to the school.'));
    }

    $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : 'unknown';
    $rate_key = 'vidya_enquiry_' . hash('sha256', $ip);
    $rate_count = (int) get_transient($rate_key);
    if ($rate_count >= 5) {
        return new WP_Error('vidya_enquiry_rate_limited', 'Too many enquiries were sent from this connection. Please try again later or call the school.', array('status' => 429));
    }

    $name_input = isset($data['name']) && is_scalar($data['name']) ? (string) $data['name'] : '';
    $name = sanitize_text_field($name_input);
    $phone = trim(isset($data['phone']) && is_scalar($data['phone']) ? (string) $data['phone'] : '');
    $email_input = trim(isset($data['email']) && is_scalar($data['email']) ? (string) $data['email'] : '');
    $email = sanitize_email($email_input);
    if ($name === '' || strlen($name) > 120) {
        return new WP_Error('vidya_enquiry_name', 'Please enter your name.', array('status' => 400));
    }
    if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
        return new WP_Error('vidya_enquiry_phone', 'Enter a valid 10-digit Indian mobile number.', array('status' => 400));
    }
    if (!is_email($email_input) || !is_email($email) || strlen($email) > 254) {
        return new WP_Error('vidya_enquiry_email', 'Enter a valid email address.', array('status' => 400));
    }

    $field_labels = array(
        'name' => 'Parent / Guardian name',
        'phone' => 'Phone number',
        'email' => 'Email address',
        'address' => 'Address / Location',
        'child_age' => 'Child age',
        'class' => 'Class interested in',
        'message' => 'Message',
    );
    $lines = array('New Vidya Academy website enquiry', '');
    foreach ($field_labels as $key => $label) {
        if ($key === 'name') {
            $value = $name;
        } elseif ($key === 'phone') {
            $value = $phone;
        } elseif ($key === 'email') {
            $value = $email;
        } else {
            $value = isset($data[$key]) && is_scalar($data[$key])
                ? sanitize_textarea_field(substr((string) $data[$key], 0, 4000))
                : '';
        }
        if ($value !== '') {
            $lines[] = $label . ': ' . $value;
        }
    }

    $extras = isset($data['extra_fields']) && is_array($data['extra_fields']) ? $data['extra_fields'] : array();
    foreach ($extras as $label => $value) {
        $label = sanitize_text_field(is_scalar($label) ? (string) $label : '');
        $value = is_scalar($value) ? sanitize_textarea_field(substr((string) $value, 0, 4000)) : '';
        if ($label !== '' && $value !== '') {
            $lines[] = $label . ': ' . $value;
        }
    }

    $content = vidya_cms_get_content();
    $recipient = isset($content['siteNavigation']['schoolDetails']['email'])
        ? sanitize_email($content['siteNavigation']['schoolDetails']['email'])
        : '';
    if (!is_email($recipient)) {
        $recipient = sanitize_email(get_option('admin_email'));
    }
    if (!is_email($recipient)) {
        return new WP_Error('vidya_enquiry_recipient', 'The school email address is not configured. Please call the school.', array('status' => 500));
    }

    $headers = array('Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $email);
    set_transient($rate_key, $rate_count + 1, HOUR_IN_SECONDS);
    $sent = wp_mail($recipient, 'New website enquiry — Vidya Academy', implode("\n", $lines), $headers);
    if (!$sent) {
        return new WP_Error('vidya_enquiry_mail_failed', 'The email could not be sent right now. Please call or email the school directly.', array('status' => 500));
    }

    update_option('vidya_academy_last_enquiry_at', gmdate('c'), false);
    return rest_ensure_response(array('success' => true, 'message' => 'Thank you. Your enquiry has been sent to the school.'));
}

add_filter('rest_pre_serve_request', function ($served, $result, $request) {
    if (in_array($request->get_route(), array('/vidya/v1/content', '/vidya/v1/blogs'), true) && !headers_sent()) {
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    }
    return $served;
}, 10, 3);

add_action('admin_menu', function () {
    add_menu_page(
        'Vidya Website Content',
        'Vidya Content',
        'manage_options',
        'vidya-academy-content',
        'vidya_cms_render_admin',
        'dashicons-edit-page',
        26
    );
    add_menu_page(
        'Vidya Academy Events',
        'Events',
        'manage_options',
        'vidya-academy-events',
        'vidya_cms_render_events_admin',
        'dashicons-calendar-alt',
        27
    );
    add_menu_page(
        'Vidya Academy Achievements',
        'Achievements',
        'manage_options',
        'vidya-academy-achievements',
        'vidya_cms_render_achievements_admin',
        'dashicons-awards',
        28
    );
    add_menu_page(
        'Vidya Academy Blogs',
        'Blogs',
        'manage_options',
        'vidya-academy-blogs',
        'vidya_cms_render_blogs_admin',
        'dashicons-media-text',
        29
    );
    add_menu_page(
        'Vidya Academy FAQs',
        'FAQs',
        'manage_options',
        'vidya-academy-faqs',
        'vidya_cms_render_faqs_admin',
        'dashicons-editor-help',
        30
    );
    add_menu_page(
        'Vidya Academy SEO Landing Pages',
        'SEO Landing Pages',
        'manage_options',
        'vidya-academy-seo',
        'vidya_cms_render_seo_admin',
        'dashicons-search',
        31
    );
});

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_vidya-academy-content' && strpos($hook, '_page_vidya-academy-') === false) {
        return;
    }
    wp_enqueue_media();
    if (strpos($hook, 'vidya-academy-events') !== false || strpos($hook, 'vidya-academy-achievements') !== false || strpos($hook, 'vidya-academy-blogs') !== false) {
        wp_enqueue_editor();
    }
    wp_enqueue_style('vidya-cms-admin', plugins_url('assets/admin.css', __FILE__), array(), VIDYA_CMS_VERSION);
    wp_enqueue_script('vidya-cms-admin', plugins_url('assets/admin.js', __FILE__), array(), VIDYA_CMS_VERSION, true);
});

function vidya_cms_render_admin() {
    if (!current_user_can('manage_options')) {
        return;
    }
    $content = vidya_cms_get_content();
    $defaults = vidya_cms_defaults();
    $labels = array(
        'navbar' => 'Navbar',
        'footer' => 'Footer',
        'home' => 'Homepage',
        'learningPathways' => 'Programs',
        'admissions' => 'Admissions',
        'campus' => 'Campus',
        'mandatoryDisclosure' => 'Mandatory Disclosure',
        'motion' => 'Motion-In',
        'motionEvents' => 'Events Page Text',
        'motionAchievements' => 'Achievements Page Text',
        'about' => 'About',
        'contact' => 'Contact',
        'notFound' => '404 Page',
        'blogs' => 'Blogs Page Text',
    );
    ?>
    <div class="wrap vidya-cms-wrap">
      <h1>Vidya Academy Website Content</h1>
      <p class="vidya-cms-lead">Choose Navbar, Footer, or a page. Open a section, edit the text or image, then save. SEO pages should answer a distinct family question with original, useful information.</p>
      <?php if (isset($_GET['updated'])) : ?>
        <div class="notice notice-success is-dismissible"><p>Website content saved. Refresh the website to view the changes.</p></div>
      <?php endif; ?>
      <div class="notice notice-info inline"><p><strong>Image sizes:</strong> only hero images use two uploads. Standard desktop/tablet hero: 1920 × 1080 px; phone: 900 × 1600 px. Event, achievement, and blog detail hero: 1600 × 1200 px; phone: 900 × 1200 px. All other photo fields use one image across devices. The editor shows the matching size beside each field; see the plugin’s IMAGE-SIZES.txt for the full list.</p></div>
      <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" id="vidya-cms-form">
        <input type="hidden" name="action" value="vidya_cms_save">
        <?php wp_nonce_field('vidya_cms_save', 'vidya_cms_nonce'); ?>
        <div class="vidya-cms-tabs" role="tablist" aria-label="Website areas">
        <?php $first = true; foreach ($labels as $key => $label) : ?>
          <?php if ($key === 'navbar' || $key === 'footer' || isset($content[$key])) : ?>
              <button type="button" class="vidya-cms-tab<?php echo $first ? ' is-active' : ''; ?>" data-panel="vidya-panel-<?php echo esc_attr($key); ?>" role="tab" aria-selected="<?php echo $first ? 'true' : 'false'; ?>"><?php echo esc_html($label); ?></button>
              <?php $first = false; ?>
            <?php endif; ?>
          <?php endforeach; ?>
        </div>
        <?php $first = true; foreach ($labels as $key => $label) : ?>
          <?php if ($key === 'navbar' || $key === 'footer' || isset($content[$key])) :
              if ($key === 'navbar') {
                  $panel_content = array('navbarData' => $content['siteNavigation']['navbarData']);
                  $panel_default = array('navbarData' => $defaults['siteNavigation']['navbarData']);
                  $save_key = 'navbar';
              } elseif ($key === 'footer') {
                  $panel_content = array(
                      'footerColumns' => $content['siteNavigation']['footerColumns'],
                      'footerCopy' => $content['siteNavigation']['footerCopy'],
                      'schoolDetails' => $content['siteNavigation']['schoolDetails'],
                      'socialLinks' => $content['siteNavigation']['socialLinks'],
                  );
                  $panel_default = array(
                      'footerColumns' => $defaults['siteNavigation']['footerColumns'],
                      'footerCopy' => $defaults['siteNavigation']['footerCopy'],
                      'schoolDetails' => $defaults['siteNavigation']['schoolDetails'],
                      'socialLinks' => $defaults['siteNavigation']['socialLinks'],
                  );
                  $save_key = 'footer';
              } else {
                  $panel_content = $content[$key];
                  $panel_default = isset($defaults[$key]) ? $defaults[$key] : array();
                  $save_key = $key;
              }
              $json = wp_json_encode($panel_content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
              $default_json = wp_json_encode($panel_default, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
          ?>
            <section id="vidya-panel-<?php echo esc_attr($key); ?>" class="vidya-cms-panel<?php echo $first ? ' is-active' : ''; ?>" role="tabpanel" <?php echo $first ? '' : 'hidden'; ?>>
              <div class="vidya-cms-panel-heading">
                <div><h2><?php echo esc_html($label); ?></h2><p>Change only the content you need. The website layout and styling stay the same.</p></div>
              </div>
              <div class="vidya-cms-editor" data-page="<?php echo esc_attr($key); ?>" data-content="<?php echo esc_attr($json); ?>" data-default="<?php echo esc_attr($default_json); ?>"></div>
              <textarea class="vidya-cms-json" name="content[<?php echo esc_attr($save_key); ?>]" hidden></textarea>
            </section>
            <?php $first = false; ?>
          <?php endif; ?>
        <?php endforeach; ?>
        <div class="vidya-cms-savebar">
          <p>Changes are stored in WordPress. Refresh the React website to see updated content.</p>
          <button type="submit" class="button button-primary button-hero">Save website content</button>
        </div>
      </form>
    </div>
    <?php
}

function vidya_cms_render_seo_admin() {
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to manage SEO landing pages.', 'vidya-academy-cms'));
    }
    $content = vidya_cms_get_content();
    $defaults = vidya_cms_defaults();
    $pages = isset($content['seoLandingPages']) && is_array($content['seoLandingPages']) ? $content['seoLandingPages'] : array();
    $json = wp_json_encode($pages, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $default_json = wp_json_encode($defaults['seoLandingPages'] ?? array(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    ?>
    <div class="wrap vidya-cms-wrap vidya-cms-seo-wrap">
      <h1>SEO Landing Pages</h1>
      <p class="vidya-cms-lead">Create and manage search landing pages here. Set the meta title and description, then paste your page body HTML and page-specific CSS.</p>
      <?php if (isset($_GET['updated'])) : ?><div class="notice notice-success is-dismissible"><p>SEO landing pages saved. Refresh the React website to view changes.</p></div><?php endif; ?>
      <div class="notice notice-info inline"><p>Paste body markup into <strong>Custom page HTML</strong> and page styles into <strong>Custom page CSS</strong>. The React navigation and footer stay in place; CSS is scoped to the landing page and unsafe HTML is removed.</p></div>
      <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" id="vidya-cms-form">
        <input type="hidden" name="action" value="vidya_cms_save">
        <input type="hidden" name="return_page" value="vidya-academy-seo">
        <?php wp_nonce_field('vidya_cms_save', 'vidya_cms_nonce'); ?>
        <section class="vidya-cms-panel is-active">
          <div class="vidya-cms-panel-heading"><div><h2>Landing page content</h2><p>Add, edit, reorder, or remove individual SEO pages.</p></div></div>
          <div class="vidya-cms-editor" data-page="seoLandingPages" data-content="<?php echo esc_attr($json); ?>" data-default="<?php echo esc_attr($default_json); ?>"></div>
          <textarea class="vidya-cms-json" name="content[seoLandingPages]" hidden></textarea>
        </section>
        <div class="vidya-cms-savebar"><p>Content is stored in WordPress and served to the React website.</p><button type="submit" class="button button-primary button-hero">Save SEO landing pages</button></div>
      </form>
    </div>
    <?php
}

function vidya_cms_sanitize_value($value, $key = '') {
    if (is_array($value)) {
        $clean = array();
        foreach ($value as $child_key => $child_value) {
            $clean[$child_key] = vidya_cms_sanitize_value($child_value, is_string($child_key) ? $child_key : $key);
        }
        return $clean;
    }
    if (is_string($value)) {
        if (strtolower($key) === 'contenthtml') {
            return wp_kses_post($value);
        }
        if (strtolower($key) === 'customcss') {
            return vidya_cms_sanitize_custom_css($value);
        }
        if (strtolower($key) === 'slug') {
            return sanitize_title($value);
        }
        if (preg_match('/^(src|href|url|image|video|to)$/i', $key) || preg_match('/(image|video|url)$/i', $key)) {
            return esc_url_raw($value);
        }
        return sanitize_textarea_field($value);
    }
    if (is_bool($value) || is_numeric($value) || $value === null) {
        return $value;
    }
    return '';
}

add_action('admin_post_vidya_cms_save', function () {
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to update this content.', 'vidya-academy-cms'));
    }
    check_admin_referer('vidya_cms_save', 'vidya_cms_nonce');

    $raw = isset($_POST['content']) ? wp_unslash($_POST['content']) : array();
    $defaults = vidya_cms_defaults();
    $saved = vidya_cms_get_content();
    foreach (array('navbar', 'footer') as $split_key) {
        if (!isset($raw[$split_key]) || !is_string($raw[$split_key])) {
            continue;
        }
        $decoded = json_decode($raw[$split_key], true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            wp_die(esc_html__('The Navbar or Footer content is invalid. Reload and try saving again.', 'vidya-academy-cms'));
        }
        $decoded = vidya_cms_sanitize_value($decoded);
        if ($split_key === 'navbar') {
            $saved['siteNavigation']['navbarData'] = isset($decoded['navbarData']) ? $decoded['navbarData'] : array();
        } else {
            foreach (array('footerColumns', 'footerCopy', 'schoolDetails', 'socialLinks') as $footer_key) {
                if (array_key_exists($footer_key, $decoded)) {
                    $saved['siteNavigation'][$footer_key] = $decoded[$footer_key];
                }
            }
        }
    }
    foreach ($defaults as $page => $default_page) {
        if ($page === 'siteNavigation') {
            continue;
        }
        if (!isset($raw[$page]) || !is_string($raw[$page])) {
            continue;
        }
        $decoded = json_decode($raw[$page], true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            wp_die(esc_html__('A page has invalid content. Reload and try saving again.', 'vidya-academy-cms'));
        }
        $saved[$page] = vidya_cms_sanitize_value($decoded);
        if ($page === 'about' && isset($saved[$page]['aboutImages'])) {
            $saved[$page]['aboutImages'] = vidya_cms_about_hero_images($saved[$page]['aboutImages']);
        }
    }
    update_option(VIDYA_CMS_OPTION, $saved, false);
    update_option('vidya_academy_content_updated_at', gmdate('c'), false);
    $return_page = isset($_POST['return_page']) ? sanitize_key(wp_unslash($_POST['return_page'])) : 'vidya-academy-content';
    if (!in_array($return_page, array('vidya-academy-content', 'vidya-academy-seo'), true)) $return_page = 'vidya-academy-content';
    wp_safe_redirect(add_query_arg(array('page' => $return_page, 'updated' => '1'), admin_url('admin.php')));
    exit;
});

function vidya_cms_clean_story_gallery($gallery) {
    $images = array();
    if (!is_array($gallery)) return $images;
    foreach (array_slice($gallery, 0, 2) as $photo) {
        if (!is_array($photo) || !isset($photo['image']) || !is_string($photo['image'])) continue;
        $image = esc_url_raw($photo['image']);
        if ($image === '') continue;
        $images[] = array(
            'image' => $image,
            'imageAlt' => sanitize_text_field($photo['imageAlt'] ?? ''),
            'heading' => sanitize_text_field($photo['heading'] ?? ''),
            'caption' => sanitize_text_field($photo['caption'] ?? ''),
        );
    }
    return $images;
}

function vidya_cms_render_story_gallery($gallery) {
    $images = vidya_cms_clean_story_gallery($gallery);
    ?>
    <fieldset class="vidya-cms-story-gallery">
      <legend>Gallery photos (optional)</legend>
      <p class="description">Add two photos in addition to the cover. Laptop/tablet and phone: 1200 × 900 px per photo. Keep the subject near the centre for phone crops.</p>
      <div class="vidya-cms-simple-grid">
        <?php for ($index = 0; $index < 2; $index++) :
            $photo = $images[$index] ?? array();
            $name = 'story_gallery[' . $index . ']';
            $image = $photo['image'] ?? '';
        ?>
          <div class="vidya-cms-story-photo" data-story-photo>
            <strong>Photo <?php echo esc_html($index + 2); ?></strong>
            <input type="hidden" data-photo-url name="<?php echo esc_attr($name . '[image]'); ?>" value="<?php echo esc_attr($image); ?>">
            <img data-photo-preview class="vidya-cms-simple-image<?php echo $image ? ' has-image' : ''; ?>" <?php if ($image) : ?>src="<?php echo esc_url($image); ?>"<?php endif; ?> alt="">
            <button type="button" class="button" data-photo-choose>Upload / choose image</button>
            <button type="button" class="button-link-delete" data-photo-remove<?php echo $image ? '' : ' hidden'; ?>>Remove image</button>
            <label class="vidya-cms-field"><span class="vidya-cms-field-label">Image description (alt text)</span><input class="widefat" type="text" data-photo-alt name="<?php echo esc_attr($name . '[imageAlt]'); ?>" maxlength="250" value="<?php echo esc_attr($photo['imageAlt'] ?? ''); ?>"></label>
            <label class="vidya-cms-field"><span class="vidya-cms-field-label">Photo heading (optional)</span><input class="widefat" type="text" data-photo-heading name="<?php echo esc_attr($name . '[heading]'); ?>" maxlength="150" value="<?php echo esc_attr($photo['heading'] ?? ''); ?>"></label>
            <label class="vidya-cms-field"><span class="vidya-cms-field-label">Caption (optional)</span><input class="widefat" type="text" data-photo-caption name="<?php echo esc_attr($name . '[caption]'); ?>" maxlength="250" value="<?php echo esc_attr($photo['caption'] ?? ''); ?>"></label>
          </div>
        <?php endfor; ?>
      </div>
    </fieldset>
    <?php
}

function vidya_cms_render_motion_items_admin($type) {
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to manage this content.', 'vidya-academy-cms'));
    }
    $is_event = $type === 'events';
    $page_slug = $is_event ? 'vidya-academy-events' : 'vidya-academy-achievements';
    $option_key = $is_event ? 'motionEvents' : 'motionAchievements';
    $collection_key = $is_event ? 'events' : 'achievements';
    $label = $is_event ? 'Events' : 'Achievements';
    $content = vidya_cms_get_content();
    $items = isset($content[$option_key][$collection_key]) && is_array($content[$option_key][$collection_key])
        ? $content[$option_key][$collection_key] : array();
    $editing_index = isset($_GET['item']) ? absint($_GET['item']) : -1;
    $is_editing = isset($_GET['new']) || ($editing_index >= 0 && isset($items[$editing_index]));
    $item = $is_editing && isset($items[$editing_index]) ? $items[$editing_index] : array();
    $title = isset($item['title']) ? $item['title'] : '';
    $slug = isset($item['slug']) ? $item['slug'] : '';
    $category = isset($item['category']) ? $item['category'] : '';
    $description = isset($item['description']) ? $item['description'] : '';
    $details = isset($item['details']) && is_array($item['details']) ? implode("\n\n", $item['details']) : '';
    $details_html = isset($item['detailsHtml']) && is_string($item['detailsHtml']) && trim($item['detailsHtml']) !== ''
        ? $item['detailsHtml']
        : wpautop(esc_html($details));
    $bullet_points = isset($item['bulletPoints']) && is_array($item['bulletPoints']) ? implode("\n", $item['bulletPoints']) : '';
    $image = isset($item['image']) ? $item['image'] : '';
    $mobile_image = isset($item['mobileImage']) ? $item['mobileImage'] : '';
    $image_alt = isset($item['imageAlt']) ? $item['imageAlt'] : '';
    $gallery_title = isset($item['galleryTitle']) ? $item['galleryTitle'] : '';
    $status = isset($item['status']) && $item['status'] === 'draft' ? 'draft' : ($is_editing && $editing_index < 0 ? 'draft' : 'publish');
    $notice = isset($_GET['saved']) ? 'saved' : (isset($_GET['deleted']) ? 'deleted' : '');
    ?>
    <div class="wrap vidya-cms-wrap vidya-cms-simple-wrap">
      <h1><?php echo esc_html($label); ?></h1>
      <p class="vidya-cms-lead">Add, update, or remove a <?php echo esc_html(strtolower($is_event ? 'event' : 'achievement')); ?>. Enter the title and details once, then save.</p>
      <?php if ($notice === 'saved') : ?><div class="notice notice-success is-dismissible"><p><?php echo esc_html($label); ?> saved. The website will show the update when refreshed.</p></div><?php endif; ?>
      <?php if ($notice === 'deleted') : ?><div class="notice notice-success is-dismissible"><p><?php echo esc_html(rtrim($label, 's')); ?> deleted.</p></div><?php endif; ?>
      <?php if ($is_editing) : ?>
        <section class="vidya-cms-simple-card">
          <div class="vidya-cms-simple-card-head"><div><h2><?php echo $editing_index >= 0 ? 'Edit ' . esc_html(rtrim($label, 's')) : 'Add ' . esc_html(rtrim($label, 's')); ?></h2><p>Fill in the fields below and save once. The website detail page uses the same text.</p></div><a class="button" href="<?php echo esc_url(admin_url('admin.php?page=' . $page_slug)); ?>">Back to <?php echo esc_html($label); ?></a></div>
          <form class="vidya-cms-simple-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="vidya_cms_save_motion_item">
            <input type="hidden" name="kind" value="<?php echo esc_attr($type); ?>">
            <input type="hidden" name="item_index" value="<?php echo esc_attr($editing_index); ?>">
            <?php wp_nonce_field('vidya_cms_save_motion_item', 'vidya_cms_motion_nonce'); ?>
            <label class="vidya-cms-field"><span class="vidya-cms-field-label">Title</span><input class="widefat vidya-cms-simple-title" id="vidya-motion-title" name="item_title" type="text" value="<?php echo esc_attr($title); ?>" maxlength="180" required placeholder="Enter the title"></label>
            <label class="vidya-cms-field"><span class="vidya-cms-field-label">URL slug</span><input class="widefat" id="vidya-motion-slug" name="item_slug" type="text" value="<?php echo esc_attr($slug); ?>" maxlength="190" placeholder="Created automatically from the title"><span class="description">Created from the title. You can edit it if needed.</span></label>
            <div class="vidya-cms-simple-grid">
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Category (optional)</span><input class="widefat" name="item_category" type="text" value="<?php echo esc_attr($category); ?>" maxlength="100" placeholder="For example: School activity"></label>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Short description</span><textarea class="widefat" name="item_description" rows="3" maxlength="700" placeholder="A short introduction shown on the card."><?php echo esc_textarea($description); ?></textarea></label>
            </div>
            <div class="vidya-cms-field"><span class="vidya-cms-field-label">Article details</span><p class="description">Write normally in Visual, or switch to Text to enter HTML. Safe HTML such as headings, paragraphs, links, emphasis, and lists is supported.</p><?php wp_editor($details_html, 'vidya_motion_details', array('textarea_name' => 'item_details_html', 'media_buttons' => false, 'textarea_rows' => 14, 'quicktags' => true, 'tinymce' => true)); ?></div>
            <label class="vidya-cms-field"><span class="vidya-cms-field-label">Bullet points (optional)</span><textarea class="widefat" name="item_bullets" rows="5" placeholder="One bullet point per line."><?php echo esc_textarea($bullet_points); ?></textarea><span class="description">Enter one point per line. The website formats these as a bullet list.</span></label>
            <div class="vidya-cms-simple-grid vidya-cms-image-fields">
              <div class="vidya-cms-field"><span class="vidya-cms-field-label">Desktop hero image</span><input type="hidden" id="vidya-motion-image" name="item_image" value="<?php echo esc_attr($image); ?>"><img id="vidya-motion-image-preview" class="vidya-cms-simple-image<?php echo $image ? ' has-image' : ''; ?>" src="<?php echo esc_url($image); ?>" alt=""><button class="button" id="vidya-motion-choose-image" type="button">Upload / choose desktop image</button><button class="button-link-delete" id="vidya-motion-remove-image" type="button"<?php echo $image ? '' : ' hidden'; ?>>Remove image</button><span class="description vidya-cms-image-size-help">Desktop/tablet: 1600 × 1200 px. Upload the separately framed mobile hero image below for phones. Keep the main subject inside the frame.</span></div>
              <div class="vidya-cms-field"><span class="vidya-cms-field-label">Mobile hero image (optional)</span><input type="hidden" id="vidya-motion-mobile-image" name="item_mobile_image" value="<?php echo esc_attr($mobile_image); ?>"><img id="vidya-motion-mobile-image-preview" class="vidya-cms-simple-image<?php echo $mobile_image ? ' has-image' : ''; ?>" src="<?php echo esc_url($mobile_image); ?>" alt=""><button class="button" id="vidya-motion-choose-mobile-image" type="button">Upload / choose mobile image</button><button class="button-link-delete" id="vidya-motion-remove-mobile-image" type="button"<?php echo $mobile_image ? '' : ' hidden'; ?>>Remove mobile image</button><span class="description vidya-cms-image-size-help">Phone: 900 × 1200 px. This image appears on screens 768 px wide and below. If left blank, the desktop image is used.</span></div>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Image description (alt text)</span><input class="widefat" name="item_image_alt" type="text" value="<?php echo esc_attr($image_alt); ?>" maxlength="250" placeholder="Describe the image"></label>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Cover photo caption (optional)</span><input class="widefat" name="item_image_caption" type="text" value="<?php echo esc_attr($item['imageCaption'] ?? ''); ?>" maxlength="250"></label>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Cover photo heading (optional)</span><input class="widefat" name="item_image_heading" type="text" value="<?php echo esc_attr($item['imageHeading'] ?? ''); ?>" maxlength="150"></label>
            </div>
            <label class="vidya-cms-field"><span class="vidya-cms-field-label">Photo gallery heading (optional)</span><input class="widefat" name="item_gallery_title" type="text" value="<?php echo esc_attr($gallery_title); ?>" maxlength="100" placeholder="School photos"><span class="description">This heading appears above this item’s gallery. Leave blank to show “School photos”.</span></label>
            <?php vidya_cms_render_story_gallery($item['gallery'] ?? array()); ?>
            <label class="vidya-cms-field vidya-cms-status-field"><span class="vidya-cms-field-label">Visibility</span><select class="vidya-cms-status-select" name="item_status"><option value="draft"<?php selected($status, 'draft'); ?>>Draft — only visible in WordPress</option><option value="publish"<?php selected($status, 'publish'); ?>>Published — visible on the website</option></select></label>
            <div class="vidya-cms-simple-actions"><button class="button button-primary button-hero" type="submit"><?php echo $status === 'draft' ? 'Save as draft' : 'Publish'; ?> <?php echo esc_html(rtrim($label, 's')); ?></button><a class="button" href="<?php echo esc_url(admin_url('admin.php?page=' . $page_slug)); ?>">Cancel</a></div>
          </form>
        </section>
      <?php else : ?>
        <div class="vidya-cms-simple-list-head"><h2>Your <?php echo esc_html(strtolower($label)); ?> <span><?php echo esc_html(count($items)); ?></span></h2><a class="button button-primary" href="<?php echo esc_url(admin_url('admin.php?page=' . $page_slug . '&new=1')); ?>">+ Add <?php echo esc_html(rtrim($label, 's')); ?></a></div>
        <?php if (!$items) : ?><div class="vidya-cms-blog-empty"><h2>No <?php echo esc_html(strtolower($label)); ?> yet</h2><p>Choose <strong>+ Add <?php echo esc_html(rtrim($label, 's')); ?></strong> to create the first one.</p></div><?php else : ?>
          <div class="vidya-cms-simple-list">
            <?php foreach ($items as $index => $entry) : if (!is_array($entry)) continue; ?>
              <article class="vidya-cms-simple-row"><div class="vidya-cms-simple-row-copy"><h3><?php echo esc_html(isset($entry['title']) ? $entry['title'] : 'Untitled'); ?><span class="vidya-cms-status-badge vidya-cms-status-badge--<?php echo esc_attr(isset($entry['status']) && $entry['status'] === 'draft' ? 'draft' : 'publish'); ?>"><?php echo esc_html(isset($entry['status']) && $entry['status'] === 'draft' ? 'Draft' : 'Published'); ?></span></h3><p><?php echo esc_html(isset($entry['description']) && $entry['description'] !== '' ? $entry['description'] : (isset($entry['category']) ? $entry['category'] : '')); ?></p><small>/motion/<?php echo esc_html($is_event ? 'events' : 'achievements'); ?>/<?php echo esc_html(isset($entry['slug']) ? $entry['slug'] : ''); ?></small></div><div class="vidya-cms-simple-row-actions"><a class="button" href="<?php echo esc_url(admin_url('admin.php?page=' . $page_slug . '&item=' . absint($index))); ?>">Edit</a><form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" onsubmit="return window.confirm('Delete this <?php echo esc_js(strtolower(rtrim($label, 's'))); ?> permanently?');"><input type="hidden" name="action" value="vidya_cms_delete_motion_item"><input type="hidden" name="kind" value="<?php echo esc_attr($type); ?>"><input type="hidden" name="item_index" value="<?php echo esc_attr($index); ?>"><?php wp_nonce_field('vidya_cms_delete_motion_item', 'vidya_cms_motion_nonce'); ?><button class="button-link-delete" type="submit">Delete</button></form></div></article>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      <?php endif; ?>
    </div>
    <?php
}

function vidya_cms_render_events_admin() { vidya_cms_render_motion_items_admin('events'); }
function vidya_cms_render_achievements_admin() { vidya_cms_render_motion_items_admin('achievements'); }

function vidya_cms_motion_item_config($kind) {
    if ($kind === 'events') return array('page' => 'vidya-academy-events', 'section' => 'motionEvents', 'list' => 'events');
    if ($kind === 'achievements') return array('page' => 'vidya-academy-achievements', 'section' => 'motionAchievements', 'list' => 'achievements');
    return false;
}

add_action('admin_post_vidya_cms_save_motion_item', function () {
    if (!current_user_can('manage_options')) wp_die(esc_html__('You do not have permission to save this item.', 'vidya-academy-cms'));
    check_admin_referer('vidya_cms_save_motion_item', 'vidya_cms_motion_nonce');
    $kind = isset($_POST['kind']) ? sanitize_key(wp_unslash($_POST['kind'])) : '';
    $config = vidya_cms_motion_item_config($kind);
    if (!$config) wp_die(esc_html__('Invalid item type.', 'vidya-academy-cms'));
    $content = vidya_cms_get_content();
    $items = isset($content[$config['section']][$config['list']]) && is_array($content[$config['section']][$config['list']]) ? $content[$config['section']][$config['list']] : array();
    $index = isset($_POST['item_index']) ? intval($_POST['item_index']) : -1;
    $title = isset($_POST['item_title']) ? sanitize_text_field(wp_unslash($_POST['item_title'])) : '';
    if ($title === '' || strlen($title) > 180) wp_die(esc_html__('Enter a title up to 180 characters.', 'vidya-academy-cms'));
    if ($index >= 0 && !isset($items[$index])) wp_die(esc_html__('This item no longer exists. Reload the page and try again.', 'vidya-academy-cms'));
    $slug_input = isset($_POST['item_slug']) ? sanitize_title(wp_unslash($_POST['item_slug'])) : '';
    $slug = $slug_input !== '' ? $slug_input : sanitize_title($title);
    $base_slug = $slug;
    $suffix = 2;
    while (true) {
        $used = false;
        foreach ($items as $existing_index => $existing_item) {
            if ((int) $existing_index !== $index && isset($existing_item['slug']) && $existing_item['slug'] === $slug) { $used = true; break; }
        }
        if (!$used) break;
        $slug = $base_slug . '-' . $suffix++;
    }
    $old = $index >= 0 ? $items[$index] : array();
    $details_html = isset($_POST['item_details_html']) ? wp_kses_post(wp_unslash($_POST['item_details_html'])) : '';
    $paragraph_text = str_ireplace(array('</p>', '<br>', '<br/>', '<br />', '</li>'), "\n", $details_html);
    $paragraph_text = wp_strip_all_tags($paragraph_text);
    $paragraphs = preg_split('/\R\s*\R+/', trim($paragraph_text));
    $paragraphs = array_values(array_filter(array_map('trim', $paragraphs), function ($paragraph) { return $paragraph !== ''; }));
    $bullet_text = isset($_POST['item_bullets']) ? sanitize_textarea_field(wp_unslash($_POST['item_bullets'])) : '';
    $bullets = array_values(array_filter(array_map('trim', preg_split('/\R/', $bullet_text)), function ($point) { return $point !== ''; }));
    $item = array_merge(is_array($old) ? $old : array(), array(
        'slug' => $slug,
        'category' => isset($_POST['item_category']) ? sanitize_text_field(wp_unslash($_POST['item_category'])) : '',
        'title' => $title,
        'description' => isset($_POST['item_description']) ? sanitize_textarea_field(wp_unslash($_POST['item_description'])) : '',
        'details' => $paragraphs,
        'detailsHtml' => $details_html,
        'bulletPoints' => $bullets,
        'image' => isset($_POST['item_image']) ? esc_url_raw(wp_unslash($_POST['item_image'])) : '',
        'mobileImage' => isset($_POST['item_mobile_image']) ? esc_url_raw(wp_unslash($_POST['item_mobile_image'])) : '',
        'imageAlt' => isset($_POST['item_image_alt']) ? sanitize_text_field(wp_unslash($_POST['item_image_alt'])) : '',
        'imageHeading' => isset($_POST['item_image_heading']) ? sanitize_text_field(wp_unslash($_POST['item_image_heading'])) : '',
        'galleryTitle' => isset($_POST['item_gallery_title']) ? sanitize_text_field(wp_unslash($_POST['item_gallery_title'])) : '',
        'status' => isset($_POST['item_status']) && wp_unslash($_POST['item_status']) === 'publish' ? 'publish' : 'draft',
    ));
    if (isset($_POST['story_gallery'])) {
        $item['gallery'] = vidya_cms_clean_story_gallery(wp_unslash($_POST['story_gallery']));
    }
    if (isset($_POST['item_image_caption'])) {
        $item['imageCaption'] = sanitize_text_field(wp_unslash($_POST['item_image_caption']));
    }
    if (isset($_POST['item_image_heading'])) {
        $item['imageHeading'] = sanitize_text_field(wp_unslash($_POST['item_image_heading']));
    }
    if ($index >= 0) $items[$index] = $item; else $items[] = $item;
    $content[$config['section']][$config['list']] = array_values($items);
    update_option(VIDYA_CMS_OPTION, $content, false);
    update_option('vidya_academy_content_updated_at', gmdate('c'), false);
    wp_safe_redirect(add_query_arg(array('page' => $config['page'], 'saved' => '1'), admin_url('admin.php')));
    exit;
});

add_action('admin_post_vidya_cms_delete_motion_item', function () {
    if (!current_user_can('manage_options')) wp_die(esc_html__('You do not have permission to delete this item.', 'vidya-academy-cms'));
    check_admin_referer('vidya_cms_delete_motion_item', 'vidya_cms_motion_nonce');
    $kind = isset($_POST['kind']) ? sanitize_key(wp_unslash($_POST['kind'])) : '';
    $config = vidya_cms_motion_item_config($kind);
    if (!$config) wp_die(esc_html__('Invalid item type.', 'vidya-academy-cms'));
    $index = isset($_POST['item_index']) ? absint($_POST['item_index']) : -1;
    $content = vidya_cms_get_content();
    if (!isset($content[$config['section']][$config['list']][$index])) wp_die(esc_html__('This item no longer exists.', 'vidya-academy-cms'));
    array_splice($content[$config['section']][$config['list']], $index, 1);
    update_option(VIDYA_CMS_OPTION, $content, false);
    update_option('vidya_academy_content_updated_at', gmdate('c'), false);
    wp_safe_redirect(add_query_arg(array('page' => $config['page'], 'deleted' => '1'), admin_url('admin.php')));
    exit;
});

function vidya_cms_render_faqs_admin() {
    if (!current_user_can('manage_options')) wp_die(esc_html__('You do not have permission to manage FAQs.', 'vidya-academy-cms'));
    $content = vidya_cms_get_content();
    $items = isset($content['home']['faqItems']) && is_array($content['home']['faqItems']) ? $content['home']['faqItems'] : array();
    $editing_index = isset($_GET['item']) ? absint($_GET['item']) : -1;
    $is_editing = isset($_GET['new']) || ($editing_index >= 0 && isset($items[$editing_index]));
    $item = $is_editing && isset($items[$editing_index]) && is_array($items[$editing_index]) ? $items[$editing_index] : array();
    $question = isset($item['question']) ? $item['question'] : '';
    $answer = isset($item['answer']) ? $item['answer'] : '';
    $status = isset($item['status']) && $item['status'] === 'draft' ? 'draft' : ($is_editing && $editing_index < 0 ? 'draft' : 'publish');
    ?>
    <div class="wrap vidya-cms-wrap vidya-cms-simple-wrap">
      <h1>Parent FAQs</h1>
      <p class="vidya-cms-lead">Add or update questions shown on the homepage. Draft FAQs stay hidden from website visitors.</p>
      <?php if (isset($_GET['saved'])) : ?><div class="notice notice-success is-dismissible"><p>FAQ saved. The website will show it after you publish it.</p></div><?php endif; ?>
      <?php if (isset($_GET['deleted'])) : ?><div class="notice notice-success is-dismissible"><p>FAQ deleted.</p></div><?php endif; ?>
      <?php if ($is_editing) : ?>
        <section class="vidya-cms-simple-card">
          <div class="vidya-cms-simple-card-head"><div><h2><?php echo $editing_index >= 0 ? 'Edit FAQ' : 'Add FAQ'; ?></h2><p>Enter the question and answer, choose draft or published, then save.</p></div><a class="button" href="<?php echo esc_url(admin_url('admin.php?page=vidya-academy-faqs')); ?>">Back to FAQs</a></div>
          <form class="vidya-cms-simple-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="vidya_cms_save_faq">
            <input type="hidden" name="faq_index" value="<?php echo esc_attr($editing_index); ?>">
            <?php wp_nonce_field('vidya_cms_save_faq', 'vidya_cms_faq_nonce'); ?>
            <label class="vidya-cms-field"><span class="vidya-cms-field-label">Question</span><input class="widefat vidya-cms-simple-title" name="faq_question" type="text" value="<?php echo esc_attr($question); ?>" maxlength="300" required placeholder="Enter the parent’s question"></label>
            <label class="vidya-cms-field"><span class="vidya-cms-field-label">Answer</span><textarea class="widefat vidya-cms-details" name="faq_answer" rows="8" maxlength="5000" required placeholder="Write the answer in clear, simple language."><?php echo esc_textarea($answer); ?></textarea></label>
            <label class="vidya-cms-field vidya-cms-status-field"><span class="vidya-cms-field-label">Visibility</span><select class="vidya-cms-status-select" name="faq_status"><option value="draft"<?php selected($status, 'draft'); ?>>Draft — only visible in WordPress</option><option value="publish"<?php selected($status, 'publish'); ?>>Published — visible on the website</option></select></label>
            <div class="vidya-cms-simple-actions"><button class="button button-primary button-hero" type="submit"><?php echo $status === 'draft' ? 'Save as draft' : 'Publish FAQ'; ?></button><a class="button" href="<?php echo esc_url(admin_url('admin.php?page=vidya-academy-faqs')); ?>">Cancel</a></div>
          </form>
        </section>
      <?php else : ?>
        <div class="vidya-cms-simple-list-head"><h2>Your questions <span><?php echo esc_html(count($items)); ?></span></h2><a class="button button-primary" href="<?php echo esc_url(admin_url('admin.php?page=vidya-academy-faqs&new=1')); ?>">+ Add FAQ</a></div>
        <?php if (!$items) : ?><div class="vidya-cms-blog-empty"><h2>No FAQs yet</h2><p>Choose <strong>+ Add FAQ</strong> to add the first question.</p></div><?php else : ?>
          <div class="vidya-cms-simple-list">
            <?php foreach ($items as $index => $entry) : if (!is_array($entry)) continue; $is_draft = isset($entry['status']) && $entry['status'] === 'draft'; ?>
              <article class="vidya-cms-simple-row"><div class="vidya-cms-simple-row-copy"><h3><?php echo esc_html(isset($entry['question']) ? $entry['question'] : 'Untitled question'); ?><span class="vidya-cms-status-badge vidya-cms-status-badge--<?php echo $is_draft ? 'draft' : 'publish'; ?>"><?php echo $is_draft ? 'Draft' : 'Published'; ?></span></h3><p><?php echo esc_html(isset($entry['answer']) ? $entry['answer'] : ''); ?></p></div><div class="vidya-cms-simple-row-actions"><a class="button" href="<?php echo esc_url(admin_url('admin.php?page=vidya-academy-faqs&item=' . absint($index))); ?>">Edit</a><form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" onsubmit="return window.confirm('Delete this FAQ permanently?');"><input type="hidden" name="action" value="vidya_cms_delete_faq"><input type="hidden" name="faq_index" value="<?php echo esc_attr($index); ?>"><?php wp_nonce_field('vidya_cms_delete_faq', 'vidya_cms_faq_nonce'); ?><button class="button-link-delete" type="submit">Delete</button></form></div></article>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      <?php endif; ?>
    </div>
    <?php
}

add_action('admin_post_vidya_cms_save_faq', function () {
    if (!current_user_can('manage_options')) wp_die(esc_html__('You do not have permission to save FAQs.', 'vidya-academy-cms'));
    check_admin_referer('vidya_cms_save_faq', 'vidya_cms_faq_nonce');
    $question = isset($_POST['faq_question']) ? sanitize_text_field(wp_unslash($_POST['faq_question'])) : '';
    $answer = isset($_POST['faq_answer']) ? sanitize_textarea_field(wp_unslash($_POST['faq_answer'])) : '';
    if ($question === '' || $answer === '') wp_die(esc_html__('Enter both a question and an answer.', 'vidya-academy-cms'));
    $index = isset($_POST['faq_index']) ? intval($_POST['faq_index']) : -1;
    $content = vidya_cms_get_content();
    $items = isset($content['home']['faqItems']) && is_array($content['home']['faqItems']) ? $content['home']['faqItems'] : array();
    if ($index >= 0 && !isset($items[$index])) wp_die(esc_html__('This FAQ no longer exists. Reload and try again.', 'vidya-academy-cms'));
    $status = isset($_POST['faq_status']) && wp_unslash($_POST['faq_status']) === 'publish' ? 'publish' : 'draft';
    $faq = array_merge(isset($items[$index]) && is_array($items[$index]) ? $items[$index] : array(), array(
        'question' => $question,
        'answer' => $answer,
        'status' => $status,
    ));
    if ($index >= 0) $items[$index] = $faq; else $items[] = $faq;
    $content['home']['faqItems'] = array_values($items);
    update_option(VIDYA_CMS_OPTION, $content, false);
    update_option('vidya_academy_content_updated_at', gmdate('c'), false);
    wp_safe_redirect(add_query_arg(array('page' => 'vidya-academy-faqs', 'saved' => '1'), admin_url('admin.php')));
    exit;
});

add_action('admin_post_vidya_cms_delete_faq', function () {
    if (!current_user_can('manage_options')) wp_die(esc_html__('You do not have permission to delete FAQs.', 'vidya-academy-cms'));
    check_admin_referer('vidya_cms_delete_faq', 'vidya_cms_faq_nonce');
    $index = isset($_POST['faq_index']) ? absint($_POST['faq_index']) : -1;
    $content = vidya_cms_get_content();
    if (!isset($content['home']['faqItems'][$index])) wp_die(esc_html__('This FAQ no longer exists.', 'vidya-academy-cms'));
    array_splice($content['home']['faqItems'], $index, 1);
    update_option(VIDYA_CMS_OPTION, $content, false);
    update_option('vidya_academy_content_updated_at', gmdate('c'), false);
    wp_safe_redirect(add_query_arg(array('page' => 'vidya-academy-faqs', 'deleted' => '1'), admin_url('admin.php')));
    exit;
});

function vidya_cms_render_blogs_admin() {
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to manage blog posts.', 'vidya-academy-cms'));
    }
    $post_id = isset($_GET['post_id']) ? absint($_GET['post_id']) : 0;
    $post = $post_id ? get_post($post_id) : null;
    if ($post && ($post->post_type !== VIDYA_CMS_BLOG_TYPE || !current_user_can('edit_post', $post_id))) {
        wp_die(esc_html__('You do not have permission to edit this blog post.', 'vidya-academy-cms'));
    }
    $is_editing = isset($_GET['new']) || $post;
    $title = $post ? $post->post_title : '';
    $slug = $post ? $post->post_name : '';
    $excerpt = $post ? $post->post_excerpt : '';
    $content = $post ? $post->post_content : '';
    $meta_title = $post ? get_post_meta($post_id, '_vidya_blog_meta_title', true) : '';
    $meta_description = $post ? get_post_meta($post_id, '_vidya_blog_meta_description', true) : '';
    $custom_html = $post ? get_post_meta($post_id, '_vidya_blog_custom_html', true) : '';
    $custom_css = $post ? get_post_meta($post_id, '_vidya_blog_custom_css', true) : '';
    $status = $post ? $post->post_status : 'draft';
    $date = $post ? get_post_time('Y-m-d\\TH:i', false, $post) : current_time('Y-m-d\\TH:i');
    $image_id = $post ? get_post_thumbnail_id($post_id) : 0;
    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'medium') : '';
    $mobile_image_id = $post ? absint(get_post_meta($post_id, '_vidya_blog_mobile_image_id', true)) : 0;
    $mobile_image_url = $mobile_image_id ? wp_get_attachment_image_url($mobile_image_id, 'medium') : '';
    $image_alt = $post ? get_post_meta($post_id, '_vidya_blog_image_alt', true) : '';
    $image_heading = $post ? get_post_meta($post_id, '_vidya_blog_image_heading', true) : '';
    $image_caption = $post ? get_post_meta($post_id, '_vidya_blog_image_caption', true) : '';
    $gallery_title = $post ? get_post_meta($post_id, '_vidya_blog_gallery_title', true) : '';
    ?>
    <div class="wrap vidya-cms-wrap vidya-cms-blog-wrap">
      <h1>Blogs</h1>
      <p class="vidya-cms-lead">Create a post once. Published stories appear newest first, 12 per page, in three columns on desktop.</p>
      <?php if (isset($_GET['saved'])) : ?><div class="notice notice-success is-dismissible"><p>Blog saved. Refresh the website to see it.</p></div><?php endif; ?>
      <?php if (isset($_GET['deleted'])) : ?><div class="notice notice-success is-dismissible"><p>Blog deleted.</p></div><?php endif; ?>
      <?php if ($is_editing) : ?>
        <div class="vidya-cms-blog-card">
          <div class="vidya-cms-blog-card-heading"><div><h2><?php echo $post ? 'Edit blog' : 'Add a blog'; ?></h2><p>Write normally, add headings, or choose bullets in the editor.</p></div><a class="button" href="<?php echo esc_url(admin_url('admin.php?page=vidya-academy-blogs')); ?>">Back to Blogs</a></div>
          <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="vidya-cms-blog-form">
            <input type="hidden" name="action" value="vidya_cms_save_blog">
            <input type="hidden" name="post_id" value="<?php echo esc_attr($post_id); ?>">
            <?php wp_nonce_field('vidya_cms_save_blog', 'vidya_cms_blog_nonce'); ?>
            <div class="vidya-cms-blog-main-fields">
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Title</span><input id="vidya-blog-title" class="regular-text vidya-cms-blog-title" type="text" name="blog_title" value="<?php echo esc_attr($title); ?>" maxlength="180" required></label>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">URL slug</span><input id="vidya-blog-slug" class="regular-text" type="text" name="blog_slug" value="<?php echo esc_attr($slug); ?>" maxlength="190"><span class="description">Created from the title automatically. You can edit it here.</span></label>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Short description</span><textarea class="large-text" name="blog_excerpt" rows="3" maxlength="500" placeholder="A short summary shown on the Blogs page."><?php echo esc_textarea($excerpt); ?></textarea></label>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Meta title</span><input class="widefat" type="text" name="blog_meta_title" value="<?php echo esc_attr($meta_title); ?>" maxlength="180" placeholder="Defaults to the blog title and Vidya Academy"></label>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Meta description</span><textarea class="large-text" name="blog_meta_description" rows="3" maxlength="320" placeholder="A concise search result description for this story."><?php echo esc_textarea($meta_description); ?></textarea></label>
              <div class="vidya-cms-field"><span class="vidya-cms-field-label">Article text</span><p class="description">Edit every paragraph here. Use Visual for normal writing, or Text to edit the HTML. The formatting buttons add headings, links, and lists.</p><?php wp_editor($content, 'vidya_blog_content', array('textarea_name' => 'blog_content', 'media_buttons' => false, 'textarea_rows' => 14, 'quicktags' => true, 'tinymce' => true)); ?></div>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Custom article HTML (optional)</span><textarea class="large-text code vidya-cms-html-input" name="blog_custom_html" rows="18" spellcheck="false" placeholder="Paste the article body HTML only. Do not include script or style tags."><?php echo esc_textarea($custom_html); ?></textarea><span class="description">When provided, this replaces the rich text article body. WordPress removes unsafe HTML. The title, hero image and gallery remain available.</span></label>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Custom article CSS (optional)</span><textarea class="large-text code vidya-cms-html-input vidya-cms-css-input" name="blog_custom_css" rows="16" spellcheck="false" placeholder=".story-layout { display: grid; gap: 2rem; }\n.story-layout h2 { color: #07583d; }"><?php echo esc_textarea($custom_css); ?></textarea><span class="description">Selectors are scoped to this article content so they cannot change the React navigation or footer. Scripts and @import are not supported.</span></label>
              <label class="vidya-cms-field"><span class="vidya-cms-field-label">Photo gallery heading (optional)</span><input class="widefat" type="text" name="blog_gallery_title" value="<?php echo esc_attr($gallery_title); ?>" maxlength="150" placeholder="Story photos"><span class="description">This heading appears above the story photos for this blog.</span></label>
              <?php vidya_cms_render_story_gallery($post ? get_post_meta($post_id, '_vidya_blog_gallery', true) : array()); ?>
            </div>
            <aside class="vidya-cms-blog-side">
              <div class="vidya-cms-blog-side-card"><h3>Desktop hero image</h3>
                <input type="hidden" id="vidya-blog-image-id" name="blog_image_id" value="<?php echo esc_attr($image_id); ?>">
                <img id="vidya-blog-image-preview" class="vidya-cms-blog-image-preview<?php echo $image_url ? ' has-image' : ''; ?>" src="<?php echo esc_url($image_url); ?>" alt="">
                <button type="button" class="button" id="vidya-blog-select-image">Choose image</button>
                <button type="button" class="button-link-delete" id="vidya-blog-remove-image"<?php echo $image_id ? '' : ' hidden'; ?>>Remove image</button>
                <label class="vidya-cms-field"><span class="vidya-cms-field-label">Image description (alt text)</span><input class="widefat" type="text" name="blog_image_alt" value="<?php echo esc_attr($image_alt); ?>" maxlength="250"></label>
                <label class="vidya-cms-field"><span class="vidya-cms-field-label">Cover photo heading (optional)</span><input class="widefat" type="text" name="blog_image_heading" value="<?php echo esc_attr($image_heading); ?>" maxlength="150"></label>
                <label class="vidya-cms-field"><span class="vidya-cms-field-label">Cover photo caption (optional)</span><input class="widefat" type="text" name="blog_image_caption" value="<?php echo esc_attr($image_caption); ?>" maxlength="250"></label>
                <p class="description vidya-cms-image-size-help">Desktop/tablet: 1600 × 1200 px. Add a separate mobile hero image below. If no image is selected, the website uses a Vidya Academy photo bundled with the React project.</p>
              </div>
              <div class="vidya-cms-blog-side-card"><h3>Mobile hero image (optional)</h3>
                <input type="hidden" id="vidya-blog-mobile-image-id" name="blog_mobile_image_id" value="<?php echo esc_attr($mobile_image_id); ?>">
                <img id="vidya-blog-mobile-image-preview" class="vidya-cms-blog-image-preview<?php echo $mobile_image_url ? ' has-image' : ''; ?>" src="<?php echo esc_url($mobile_image_url); ?>" alt="">
                <button type="button" class="button" id="vidya-blog-mobile-select-image">Choose mobile image</button>
                <button type="button" class="button-link-delete" id="vidya-blog-mobile-remove-image"<?php echo $mobile_image_id ? '' : ' hidden'; ?>>Remove mobile image</button>
                <p class="description vidya-cms-image-size-help">Phone: 900 × 1200 px. Upload a portrait crop for the blog article hero. Leave blank to reuse the desktop hero image.</p>
              </div>
              <div class="vidya-cms-blog-side-card"><h3>Publish</h3>
                <label class="vidya-cms-field"><span class="vidya-cms-field-label">Status</span><select name="blog_status"><option value="draft"<?php selected($status, 'draft'); ?>>Draft</option><option value="publish"<?php selected($status, 'publish'); ?>>Published</option></select></label>
                <label class="vidya-cms-field"><span class="vidya-cms-field-label">Publication date</span><input class="widefat" type="datetime-local" name="blog_date" value="<?php echo esc_attr($date); ?>"></label>
              </div>
            </aside>
            <div class="vidya-cms-blog-actions"><button type="submit" class="button button-primary button-hero">Save blog</button></div>
          </form>
        </div>
      <?php else : ?>
        <div class="vidya-cms-blog-list-head"><h2>Your blog posts</h2><a class="button button-primary" href="<?php echo esc_url(admin_url('admin.php?page=vidya-academy-blogs&new=1')); ?>">Add new blog</a></div>
        <?php $blogs = get_posts(array('post_type' => VIDYA_CMS_BLOG_TYPE, 'post_status' => array('publish', 'draft', 'pending', 'future', 'private'), 'numberposts' => -1, 'orderby' => 'date', 'order' => 'DESC')); ?>
        <?php if (!$blogs) : ?><div class="vidya-cms-blog-empty"><h2>No blogs yet</h2><p>Choose <strong>Add new blog</strong> to publish the first story.</p></div><?php else : ?>
          <div class="vidya-cms-blog-table-wrap"><table class="widefat striped vidya-cms-blog-table"><thead><tr><th>Title</th><th>Status</th><th>Published</th><th>Actions</th></tr></thead><tbody>
            <?php foreach ($blogs as $blog) : ?><tr><td><strong><?php echo esc_html($blog->post_title); ?></strong><small><?php echo esc_html('/blogs/' . $blog->post_name); ?></small></td><td><span class="vidya-cms-blog-status vidya-cms-blog-status--<?php echo esc_attr($blog->post_status); ?>"><?php echo esc_html(ucfirst($blog->post_status)); ?></span></td><td><?php echo esc_html(get_post_time('M j, Y', false, $blog)); ?></td><td class="vidya-cms-blog-row-actions"><a class="button" href="<?php echo esc_url(admin_url('admin.php?page=vidya-academy-blogs&post_id=' . $blog->ID)); ?>">Edit</a><form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" onsubmit="return window.confirm('Delete this blog permanently?');"><input type="hidden" name="action" value="vidya_cms_delete_blog"><input type="hidden" name="post_id" value="<?php echo esc_attr($blog->ID); ?>"><?php wp_nonce_field('vidya_cms_delete_blog_' . $blog->ID, 'vidya_cms_blog_nonce'); ?><button type="submit" class="button-link-delete">Delete</button></form></td></tr><?php endforeach; ?>
          </tbody></table></div>
        <?php endif; ?>
      <?php endif; ?>
    </div>
    <?php
}

add_action('admin_post_vidya_cms_save_blog', 'vidya_cms_save_blog');
function vidya_cms_save_blog() {
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to save blog posts.', 'vidya-academy-cms'));
    }
    check_admin_referer('vidya_cms_save_blog', 'vidya_cms_blog_nonce');
    $post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;
    if ($post_id && (!current_user_can('edit_post', $post_id) || get_post_type($post_id) !== VIDYA_CMS_BLOG_TYPE)) {
        wp_die(esc_html__('You do not have permission to edit this blog.', 'vidya-academy-cms'));
    }
    $title = isset($_POST['blog_title']) ? sanitize_text_field(wp_unslash($_POST['blog_title'])) : '';
    if ($title === '' || strlen($title) > 180) {
        wp_die(esc_html__('Please enter a blog title up to 180 characters.', 'vidya-academy-cms'));
    }
    $requested_status = isset($_POST['blog_status']) ? sanitize_key(wp_unslash($_POST['blog_status'])) : 'draft';
    $status = in_array($requested_status, array('draft', 'publish'), true) ? $requested_status : 'draft';
    if ($status === 'publish' && !current_user_can('publish_posts')) {
        $status = 'draft';
    }
    $date_input = isset($_POST['blog_date']) ? sanitize_text_field(wp_unslash($_POST['blog_date'])) : '';
    $date_object = $date_input ? DateTimeImmutable::createFromFormat('Y-m-d\\TH:i', $date_input, wp_timezone()) : false;
    $post_date = $date_object ? $date_object->format('Y-m-d H:i:s') : current_time('mysql');
    $raw_slug = isset($_POST['blog_slug']) ? sanitize_title(wp_unslash($_POST['blog_slug'])) : '';
    $slug = $raw_slug !== '' ? $raw_slug : sanitize_title($title);
    $post_data = array(
        'ID' => $post_id,
        'post_type' => VIDYA_CMS_BLOG_TYPE,
        'post_title' => $title,
        'post_name' => $slug,
        'post_excerpt' => isset($_POST['blog_excerpt']) ? sanitize_textarea_field(wp_unslash($_POST['blog_excerpt'])) : '',
        'post_content' => isset($_POST['blog_content']) ? wp_kses_post(wp_unslash($_POST['blog_content'])) : '',
        'post_status' => $status,
        'post_date' => $post_date,
        'post_date_gmt' => get_gmt_from_date($post_date),
    );
    $saved_id = wp_insert_post($post_data, true);
    if (is_wp_error($saved_id)) {
        wp_die(esc_html($saved_id->get_error_message()));
    }
    $image_id = isset($_POST['blog_image_id']) ? absint($_POST['blog_image_id']) : 0;
    if ($image_id && wp_attachment_is_image($image_id)) {
        set_post_thumbnail($saved_id, $image_id);
    } else {
        delete_post_thumbnail($saved_id);
    }
    $image_alt = isset($_POST['blog_image_alt']) ? sanitize_text_field(wp_unslash($_POST['blog_image_alt'])) : '';
    update_post_meta($saved_id, '_vidya_blog_image_alt', $image_alt);
    update_post_meta($saved_id, '_vidya_blog_meta_title', isset($_POST['blog_meta_title']) ? sanitize_text_field(wp_unslash($_POST['blog_meta_title'])) : '');
    update_post_meta($saved_id, '_vidya_blog_meta_description', isset($_POST['blog_meta_description']) ? sanitize_textarea_field(wp_unslash($_POST['blog_meta_description'])) : '');
    update_post_meta($saved_id, '_vidya_blog_custom_html', isset($_POST['blog_custom_html']) ? wp_kses_post(wp_unslash($_POST['blog_custom_html'])) : '');
    update_post_meta($saved_id, '_vidya_blog_custom_css', isset($_POST['blog_custom_css']) ? vidya_cms_sanitize_custom_css(wp_unslash($_POST['blog_custom_css'])) : '');
    update_post_meta($saved_id, '_vidya_blog_image_heading', isset($_POST['blog_image_heading']) ? sanitize_text_field(wp_unslash($_POST['blog_image_heading'])) : '');
    update_post_meta($saved_id, '_vidya_blog_image_caption', isset($_POST['blog_image_caption']) ? sanitize_text_field(wp_unslash($_POST['blog_image_caption'])) : '');
    update_post_meta($saved_id, '_vidya_blog_gallery_title', isset($_POST['blog_gallery_title']) ? sanitize_text_field(wp_unslash($_POST['blog_gallery_title'])) : '');
    $mobile_image_id = isset($_POST['blog_mobile_image_id']) ? absint($_POST['blog_mobile_image_id']) : 0;
    if ($mobile_image_id && wp_attachment_is_image($mobile_image_id)) {
        update_post_meta($saved_id, '_vidya_blog_mobile_image_id', $mobile_image_id);
    } else {
        delete_post_meta($saved_id, '_vidya_blog_mobile_image_id');
    }
    if (isset($_POST['story_gallery'])) {
        update_post_meta($saved_id, '_vidya_blog_gallery', vidya_cms_clean_story_gallery(wp_unslash($_POST['story_gallery'])));
    }
    wp_safe_redirect(add_query_arg(array('page' => 'vidya-academy-blogs', 'post_id' => $saved_id, 'saved' => '1'), admin_url('admin.php')));
    exit;
}

add_action('admin_post_vidya_cms_delete_blog', 'vidya_cms_delete_blog');
function vidya_cms_delete_blog() {
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to delete blog posts.', 'vidya-academy-cms'));
    }
    $post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;
    check_admin_referer('vidya_cms_delete_blog_' . $post_id, 'vidya_cms_blog_nonce');
    if (!$post_id || get_post_type($post_id) !== VIDYA_CMS_BLOG_TYPE || !current_user_can('delete_post', $post_id)) {
        wp_die(esc_html__('You do not have permission to delete this blog.', 'vidya-academy-cms'));
    }
    wp_delete_post($post_id, true);
    wp_safe_redirect(add_query_arg(array('page' => 'vidya-academy-blogs', 'deleted' => '1'), admin_url('admin.php')));
    exit;
}

