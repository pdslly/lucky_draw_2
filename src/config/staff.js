import { shuffle } from "@/utils/index";
import { faker } from "@faker-js/faker";

const getImageUrl = (index) => {
  return new URL(`../assets/avatar/a_${index}.jpeg`, import.meta.url).href;
};

const _staff = new Array(80).fill(0).map((_, i) => ({
  id: i,
  name: faker.person.firstName(),
  department: faker.person.jobType(),
  avatar: getImageUrl(faker.number.int({ min: 1, max: 25 })),
}));

const staffs = shuffle(_staff);
const length = staffs.length;
const mid = Math.floor(length / 2);
const staff$1 = staffs.slice(0, mid);
const staff$2 = staffs.slice(mid);

export { staff$1, staff$2, staffs };
