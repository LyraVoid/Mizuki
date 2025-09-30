import { getPostSeries } from './utils/content-utils';

async function test() {
  const series = await getPostSeries("测试系列");
  console.log("Series posts:", series);
  console.log("Series length:", series.length);
}

test();