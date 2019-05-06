package com.dong.life.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 返回给前台的通用包装。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseData<T> implements Serializable {

    public static final String DEFAULT_SUCCESS_MESSAGE = "请求成功";

    public static final String DEFAULT_ERROR_MESSAGE = "网络异常";

    public static final Integer DEFAULT_SUCCESS_CODE = 200;

    public static final Integer DEFAULT_ERROR_CODE = 500;

    /**
     * 请求是否成功
     */
    private Boolean success;

    /**
     * 响应状态码
     */
    private Integer code;

    /**
     * 响应信息
     */
    private String message;

    /**
     * 响应对象
     */
    private T data;

    public ResponseData(T data) {
        this.success = true;
        this.code = 0;
        this.data = data;
    }

    public ResponseData(int code, String message) {
        this.success = false;
        this.code = code;
        this.message = message;
    }

    public static SuccessResponseData success() {
        return new SuccessResponseData<>(null);
    }

    public static SuccessResponseData<Object> success(Object data) {
        return new SuccessResponseData<>(data);
    }

    public static SuccessResponseData success(Integer code, String message, Object data) {
        return new SuccessResponseData<>(code, message, data);
    }

    public static ErrorResponseData error(String message) {
        return new ErrorResponseData(message);
    }

    public static ErrorResponseData error(Integer code, String message) {
        return new ErrorResponseData(code, message);
    }

    public static ErrorResponseData error(Integer code, String message, Object object) {
        return new ErrorResponseData<>(code, message, object);
    }
}
