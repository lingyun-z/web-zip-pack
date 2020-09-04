FROM nginx:1.15
COPY /dist/ /dist
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /dist
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
CMD ["nginx", "-g", "daemon off;"]
