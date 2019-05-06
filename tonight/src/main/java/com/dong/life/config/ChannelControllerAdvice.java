package com.dong.life.config;

import com.alibaba.fastjson.JSONObject;
import com.dong.life.exception.CommonException;
import com.dong.life.response.ErrorResponseData;
import com.dong.life.response.ResponseData;
import com.dong.life.response.SuccessResponseData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 全局包裹返回值
 * @author zhdong
 * Date 2018/9/2
 */
@Slf4j
@ControllerAdvice
public class ChannelControllerAdvice implements ResponseBodyAdvice
{

    @Override
    public boolean supports(MethodParameter methodParameter, Class aClass) {
        return true;
    }

    /**
     * 封装返回结果
     * @param returnValue
     * @param methodParameter
     * @param mediaType
     * @param aClass
     * @param serverHttpRequest
     * @param serverHttpResponse
     * @return
     */
    @Override
    public Object beforeBodyWrite(Object returnValue, MethodParameter methodParameter, MediaType mediaType, Class aClass, ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse) {

        Method method = methodParameter.getMethod();
        Class<?> declaringClass = methodParameter.getDeclaringClass();
        //如果已经是ResponseData，直接返回
        if ( returnValue instanceof ResponseData) {
            return returnValue;
        }
        else if ( returnValue instanceof  String ){
            try {
                return JSONObject.toJSON(SuccessResponseData.success(returnValue));
            }catch (Exception e){
                log.error("返回结果转换json异常",e);
                return ErrorResponseData.error("返回结果转换json异常");
            }
        }
        return SuccessResponseData.success(returnValue);
    }

    /**
     * 拦截未知的运行时异常
     */
    @ExceptionHandler(CommonException.class)
    @ResponseBody
    public ResponseData notFount(CommonException e, HttpServletResponse reponse) {
        log.error("系统业务异常",e);
        return new ErrorResponseData(10000, e.getMessage());
    }

    /**
     * 拦截未知的运行时异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseData notFount(Exception e, HttpServletResponse reponse) {
        log.error("系统错误",e);
        if (HttpStatus.NOT_FOUND.value() == reponse.getStatus()) {
            return new ErrorResponseData(10000, "找不到页面");
        }
        return new ErrorResponseData(10000, "系统错误："+e.getMessage());
    }

}
