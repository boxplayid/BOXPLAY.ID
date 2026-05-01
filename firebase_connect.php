<?php
// firebase_connect.php
// Backend PHP untuk koneksi ke Firebase Realtime Database via REST API

// URL dasar Firebase Realtime Database
define('FIREBASE_URL', 'https://idboxplay-7a27f-default-rtdb.asia-southeast1.firebasedatabase.app/');

// Jika dibutuhkan authentication token, isi di sini. Jika tidak, biarkan kosong.
define('FIREBASE_AUTH', '');

function firebase_request(string $method, string $path, $data = null)
{
    $url = rtrim(FIREBASE_URL, '/') . '/' . ltrim($path, '/') . '.json';
    if (FIREBASE_AUTH !== '') {
        $url .= '?auth=' . urlencode(FIREBASE_AUTH);
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    if ($data !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $error = curl_error($ch);
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($response === false) {
        return [
            'success' => false,
            'status' => $status,
            'error' => $error,
        ];
    }

    return [
        'success' => $status >= 200 && $status < 300,
        'status' => $status,
        'body' => json_decode($response, true),
        'raw' => $response,
    ];
}

function firebase_get(string $path)
{
    return firebase_request('GET', $path);
}

function firebase_set(string $path, $data)
{
    return firebase_request('PUT', $path, $data);
}

function firebase_push(string $path, $data)
{
    return firebase_request('POST', $path, $data);
}

function firebase_update(string $path, $data)
{
    return firebase_request('PATCH', $path, $data);
}

function firebase_delete(string $path)
{
    return firebase_request('DELETE', $path);
}

// Contoh penggunaan:
// $result = firebase_get('users');
// $result = firebase_set('users/user1', ['name' => 'Budi', 'email' => 'budi@example.com']);
// $result = firebase_push('messages', ['text' => 'Halo', 'created_at' => time()]);
// $result = firebase_update('users/user1', ['email' => 'budi2@example.com']);
// $result = firebase_delete('users/user1');

// Untuk debug cepat, uncomment baris berikut:
// header('Content-Type: application/json');
// echo json_encode(firebase_get(''), JSON_PRETTY_PRINT);
// TEST CONNECTION - Uncomment untuk test
if (isset($_GET['test']) && $_GET['test'] === 'connection') {
    header('Content-Type: application/json');
    $result = firebase_get('');
    echo json_encode([
        'status' => 'success',
        'message' => 'Koneksi ke Firebase berhasil!',
        'firebase_url' => FIREBASE_URL,
        'response' => $result
    ], JSON_PRETTY_PRINT);
    exit;
}