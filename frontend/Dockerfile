# First image is for building the client files
FROM node:14.17-alpine as build

ENV SKIP_PREFLIGHT_CHECK 'true'

WORKDIR /app

COPY . .

RUN yarn install

ENV DISABLE_ESLINT_PLUGIN=true
RUN yarn build

# Second image is for serving the files
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80 443 3999

CMD ["nginx", "-g", "daemon off;"]