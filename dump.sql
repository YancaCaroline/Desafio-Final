create database desafiofinal;
create table usuarios (
    id serial primary key,
    nomeDaLoja text not null,
    email text not null,
    senha text not null
);

create table produtos(
    id serial primary key,
    titulo text not null,
    categoria text not null,
    descricao text not null,
    preco integer not null,
    estoque integer not null,
    imagem text not null,
    usuario_id integer not null,
    foreign key (usuario_id) references usuarios (id)
    )
