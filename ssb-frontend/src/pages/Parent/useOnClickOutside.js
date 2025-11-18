
import { useEffect } from 'react';

/**
 * Hook này sẽ lắng nghe các cú click bên ngoài một element (ref)
 * và gọi một hàm (handler) khi điều đó xảy ra.
 */
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Nếu click vào bên trong ref, hoặc ref không tồn tại, thì không làm gì cả
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Nếu click ra ngoài, gọi hàm handler (ví dụ: đóng dropdown)
      handler(event);
    };

    // Thêm listener vào document
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Dọn dẹp listener khi component bị gỡ bỏ
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Chỉ chạy lại nếu ref hoặc handler thay đổi
}

export default useOnClickOutside;